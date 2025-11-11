import { Form, Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type LoginPageProps = {
  defaultEmail?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  formError?: string;
  isSubmitting?: boolean;
  redirectTo?: string;
};

export default function LoginPage({
  defaultEmail,
  fieldErrors,
  formError,
  isSubmitting = false,
  redirectTo = "/",
}: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
          >
            Scordi
          </Link>
          <h1 className="mt-6 text-3xl font-semibold text-gray-900">
            다시 만나서 반가워요!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            계정에 로그인하여 워크플로우를 계속 관리하세요.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">로그인</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <Form className="grid gap-6" method="post" replace>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={defaultEmail}
                  required
                  aria-invalid={fieldErrors?.email ? true : undefined}
                  aria-describedby={
                    fieldErrors?.email ? "email-error" : undefined
                  }
                />
                {fieldErrors?.email ? (
                  <p id="email-error" className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={fieldErrors?.password ? true : undefined}
                  aria-describedby={
                    fieldErrors?.password ? "password-error" : undefined
                  }
                />
                {fieldErrors?.password ? (
                  <p id="password-error" className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              {formError ? (
                <div
                  role="alert"
                  className={cn(
                    "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive",
                  )}
                >
                  {formError}
                </div>
              ) : null}

              <Button type="submit" size="md" disabled={isSubmitting}>
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
