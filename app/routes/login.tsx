import { data, redirect } from "react-router";
import type { Route } from "./+types/login";
import {compare} from "bcryptjs"
import { commitSession, getSession } from "~/session";
import { initializeDatabase, Organizations, Users } from "~/.server/db";
import LoginPage from "~/client/public/login/LoginPage";

async function getUser(
  email: string,
  password: string,
): Promise<Users> {
    const user = await Users.findOne({
        where: {
            email
        }
    })

  if (!user) {
    throw new Error('invalid credentials')
  }

  if (!(await compare(password, user.password))) {
    throw new Error('invalid credentials');
  }

  // POST /user/session 에서의 @CurrentUser() 는 여기서 정의됩니다.
  return user;
}

function extractSubdomain(request: Request): string | null {
  const host = request.headers.get("host");
  if (!host) return null;
  
  const parts = host.split('.');
  
  if (parts.length > 1) {
    return parts[0];
  }
  
  return null;
}
    
export async function loader({
  request,
}: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie"),
  );

  // Subdomain (slug) 추출
  const subdomain = extractSubdomain(request);

  await initializeDatabase()
  const org = subdomain ? await Organizations.findOne({
    where: {
      slug: subdomain
    },
    relations:[
      "memberships",
      "memberships.user"
    ]
  }) : null

  if (session.has("userId")) {
    return redirect("/");
  }

  return data(
    { 
      error: session.get("error"),
      org
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function action({
  request,
}: Route.ActionArgs) {
  const session = await getSession(
    request.headers.get("Cookie"),
  );
  
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  await initializeDatabase()
  let user: Users
  try {
    user = await getUser(username, password)
  } catch (err) {
    session.flash("error", "Invalid username/password")
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }

  // Subdomain (slug) 추출
  const subdomain = extractSubdomain(request);
  if (!subdomain) {
    session.flash("error", "Subdomain required for login")
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }
  const org = await Organizations.findOne({
    where: {
      slug: subdomain
    },
    relations:[
      "memberships",
      "memberships.user"
    ]
  })

  if(!org) {
    session.flash("error", "Organization not found")
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }
  if(!org.isAdmin(user)) {
    session.flash("error", "You do not have access to this organization")
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }

  const userId = user.id
  
  if (userId == null) {
    session.flash("error", subdomain 
      ? "Invalid username/password" 
      : "Subdomain required for login"
    );

    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // 세션에 userId와 subdomain 저장
  session.set("userId", userId.toString());
  session.set("orgId", org.id.toString());

  // Login succeeded, send them to the home page.
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login({
  loaderData,
}: Route.ComponentProps) {
  const { org } = loaderData;

    return (
     <LoginPage orgImage={org?.image } orgName={org?.name} />
    )
  }