import {
  Links,
  Meta,
  Scripts,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

import type { Route } from "./+types/login";
import LoginPage from "~/components/pages/users/LoginPage";
import { commitSession, getSession } from "~/session";
import { safeRedirect } from "~/middleware/auth";

type LoginActionData = {
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  formError?: string;
  values?: {
    email?: string;
  };
  redirectTo?: string;
};

type AuthSuccess = {
  token: string;
  userId?: string;
  orgId?: string;
};

type AuthFailure =
  | {
      reason: "invalid-credentials";
      message: string;
    }
  | {
      reason: "server-error";
      message: string;
    };

const cipherTextOn = (secret: string) => ({
  encrypt: (value: string) => AES.encrypt(value, secret).toString(),
  decrypt: (value: string) => AES.decrypt(value, secret).toString(Utf8),
});

export function encryptValue(text: string, salt = ""): string {
  const baseSecret = process.env.NEXT_PUBLIC_CARD_SIGN_KEY ?? "";
  const secret = `${baseSecret}${salt}`;

  if (!secret) {
    console.warn(
      "[encryptValue] NEXT_PUBLIC_CARD_SIGN_KEY 환경 변수가 비어 있어 암호화를 건너뜁니다.",
    );
    return text;
  }

  return cipherTextOn(secret).encrypt(text);
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("token")) {
    return redirect("/");
  }
  const url = new URL(request.url);
  const redirectTo = safeRedirect(url.searchParams.get("redirectTo"), "/");
  return Response.json({ redirectTo });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const redirectTo = safeRedirect(formData.get("redirectTo")?.toString(), "/");

  const fieldErrors: LoginActionData["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "이메일을 입력해주세요.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "유효한 이메일 주소를 입력해주세요.";
  }

  if (!password) {
    fieldErrors.password = "비밀번호를 입력해주세요.";
  } else if (password.length < 8) {
    fieldErrors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  if (fieldErrors.email || fieldErrors.password) {
    return Response.json(
      {
        fieldErrors,
        values: { email },
        redirectTo,
      } satisfies LoginActionData,
      { status: 400 },
    );
  }

  const result = await authenticateUser(email, password);

  if (!result.success) {
    const { reason, message } = result.error;

    if (reason === "invalid-credentials") {
      return Response.json(
        {
          formError: message,
          values: { email },
          redirectTo,
        } satisfies LoginActionData,
        { status: 401 },
      );
    }

    return Response.json(
      {
        formError: message,
        values: { email },
        redirectTo,
      } satisfies LoginActionData,
      { status: 500 },
    );
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", result.data.token);
  if (result.data.userId) {
    session.set("userId", result.data.userId);
  }
  if (result.data.orgId) {
    session.set("orgId", result.data.orgId);
  }

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<LoginActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const redirectTo = actionData?.redirectTo?.toString() ?? "/";

  return (
    <html lang="ko" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <LoginPage
          defaultEmail={actionData?.values?.email}
          fieldErrors={actionData?.fieldErrors}
          formError={actionData?.formError}
          isSubmitting={isSubmitting}
          redirectTo={redirectTo}
        />
        <Scripts />
      </body>
    </html>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Scordi | 로그인",
    },
    {
      name: "description",
      content: "Scordi에 로그인하여 워크플로우를 관리하세요.",
    },
  ];
}

async function authenticateUser(
  email: string,
  password: string,
): Promise<
  { success: true; data: AuthSuccess } | { success: false; error: AuthFailure }
> {
  const baseUrl = process.env.WORKFLOW_API_BASE_URL;

  if (!baseUrl) {
    return {
      success: false,
      error: {
        reason: "server-error",
        message:
          "인증 API 주소가 설정되지 않았습니다. API_BASE_URL 환경 변수를 확인해주세요.",
      },
    };
  }

  try {
    const endpoint = buildEndpoint(baseUrl, "/users/session");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: encryptValue(password) }),
    });

    const body = await parseJsonSafe(response);

    if (response.status === 401) {
      return {
        success: false,
        error: {
          reason: "invalid-credentials",
          message:
            body && typeof body === "object" && "message" in body
              ? String(body.message)
              : "이메일 또는 비밀번호가 올바르지 않습니다.",
        },
      };
    }

    if (!response.ok) {
      const errorMessage =
        (body && typeof body === "object" && "message" in body
          ? String(body.message)
          : "로그인 요청이 실패했습니다. 잠시 후 다시 시도해주세요.") +
        ` (status: ${response.status})`;

      return {
        success: false,
        error: {
          reason: "server-error",
          message: errorMessage,
        },
      };
    }

    if (!body || typeof body !== "object" || !("token" in body)) {
      return {
        success: false,
        error: {
          reason: "server-error",
          message: "로그인 응답 형식이 올바르지 않습니다.",
        },
      };
    }

    const token = String((body as Record<string, unknown>).token);
    const userId =
      typeof (body as Record<string, unknown>).userId === "string"
        ? String((body as Record<string, unknown>).userId)
        : undefined;
    const orgId =
      typeof (body as Record<string, unknown>).orgId === "string"
        ? String((body as Record<string, unknown>).orgId)
        : undefined;

    return {
      success: true,
      data: {
        token,
        userId,
        orgId,
      },
    };
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return {
      success: false,
      error: {
        reason: "server-error",
        message:
          "로그인 요청 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.",
      },
    };
  }
}

function buildEndpoint(base: string, path: string) {
  try {
    const url = new URL(path, base);
    return url.toString();
  } catch {
    throw new Error("잘못된 AUTH_API_BASE_URL 값입니다.");
  }
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
