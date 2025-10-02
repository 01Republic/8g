import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { commitSession, getSession } from "~/session";
import LoginPage from "~/client/public/login/LoginPage";
import { getOrganization, login } from "~/.server/services";

function extractSubdomain(request: Request): string | null {
  const host = request.headers.get("host");
  if (!host) return null;

  const parts = host.split(".");

  if (parts.length > 1) {
    return parts[0];
  }

  return null;
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const subdomain = extractSubdomain(request);
  if (!subdomain) {
    return redirect("/not-found");
  }

  const { org } = await getOrganization({ subdomain });
  if (!org) {
    return redirect("/not-found");
  }

  if (session.has("userId")) {
    return redirect("/");
  }

  return { org };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const subdomain = extractSubdomain(request);
  if (!subdomain) {
    return redirect("/not-found");
  }

  const form = await request.formData();
  const username = form.get("username")?.toString();
  const password = form.get("password")?.toString();

  if (!username || !password) {
    return redirect("/login");
  }

  const { user, org } = await login({ email: username, password, subdomain });
  if (!user) {
    return redirect("/login");
  }

  // 세션에 userId와 subdomain 저장
  session.set("userId", user.id.toString());
  session.set("orgId", org.id.toString());

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const { org } = loaderData!;

  return <LoginPage orgImage={org?.image} orgName={org?.name} />;
}
