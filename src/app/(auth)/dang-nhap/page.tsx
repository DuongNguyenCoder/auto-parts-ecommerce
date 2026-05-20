import { LoginForm } from "@/src/features/auth/components/login-form";
import { RegisterForm } from "@/src/features/auth/components/register-form";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <RegisterForm />
    </div>
  );
}
