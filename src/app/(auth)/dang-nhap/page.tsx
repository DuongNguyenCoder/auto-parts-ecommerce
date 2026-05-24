import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <RegisterForm />
    </div>
  );
}
