import { data, redirect } from "react-router";
import { commitSession, getSession } from "~/session";
import { initializeDatabase, Organizations, Users } from "~/.server/db";
import {compare} from "bcryptjs"
import type { Route } from "./+types/login";
import { LoginForm } from "~/components/login-form";

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
      throw new Error()
    }
  
    if (!(await compare(password, user.password))) {
      throw new Error('invalid password');
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
  if(!subdomain){
    throw new Error('Subdomain not found')
  }

  await initializeDatabase()
  const org = await Organizations.findOne({
    where: {
        slug: subdomain
    },
    relations:[
        "memberships",
        "memberships.user"
    ]
  })

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
  const user = await getUser(username, password)

  // Subdomain (slug) 추출
  const subdomain = extractSubdomain(request);
  if (!subdomain) {
    throw new Error()
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

  if(!org?.isAdmin(user)) {
    throw new Error("이 에러야?")
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
  const { error, org } = loaderData;
  const defaultLogo = 'scordi-logo.png'
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <img 
                    src={org?.image || defaultLogo} 
                    alt={org?.name || 'Organization'}
                    className="size-6 object-cover" 
                />
              {org?.name}
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="bg-muted relative lg:flex flex items-center justify-center p-8">
            <img
                src={org?.image || defaultLogo} 
                alt="Organization Image"
                className="max-w-2xl max-h-[80vh] object-cover rounded-lg shadow-lg dark:brightness-[0.2] dark:grayscale"
            />
        </div>
      </div>
    )
  }