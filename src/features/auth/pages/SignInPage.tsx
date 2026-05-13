import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui";
import { AuthForm } from "../components/AuthForm";
import { useSignIn } from "../hooks/useSignIn";

const initialValues = {
  id: "",
  name: "",
  password: "",
};

export const SignInPage = () => {
  const [values, setValues] = useState(initialValues);
  const signIn = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/todos";

  const handleChange = (field: keyof typeof initialValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signIn.mutate(
      {
        id: values.id.trim(),
        password: values.password,
      },
      {
        onSuccess: () => navigate(from, { replace: true }),
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <AuthForm
        errorMessage={signIn.error?.message}
        isPending={signIn.isPending}
        mode="signin"
        onChange={handleChange}
        onSubmit={handleSubmit}
        values={values}
      />
      <Button asChild variant="ghost">
        <Link to="/signup">회원가입으로 이동</Link>
      </Button>
    </div>
  );
};
