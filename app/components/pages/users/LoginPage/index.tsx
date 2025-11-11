import { LoginForm } from "~/components/login-form";

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
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <LoginForm
          className="w-full"
          defaultEmail={defaultEmail}
          fieldErrors={fieldErrors}
          formError={formError}
          isSubmitting={isSubmitting}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  );
}
