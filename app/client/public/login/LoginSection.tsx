import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LockKeyhole, Mail } from "lucide-react";

export const LoginSection = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {
  return (
    <form
      method="POST"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold text-gradient from-[rgb(92,95,238)] to-[rgb(165,166,245)]">
          SaaS 관리는 스코디
        </h1>
        <p className="text-gray-500 text-sm text-balance">
          팀 생산성을 높이는 소프트웨어 구독 비용 관리
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="text-primary-700 absolute left-4 inset-y-0 my-auto" />
            <Input
              id="email"
              name="username"
              type="email"
              placeholder="m@example.com"
              required
              className="py-4 pl-13"
            />
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>

          <div className="relative">
            <LockKeyhole className="text-primary-700 absolute left-4 inset-y-0 my-auto" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="py-4 pl-13"
            />
          </div>
        </div>
        <Button type="submit" className="w-full" size="md">
          로그인
        </Button>
      </div>
    </form>
  );
};
