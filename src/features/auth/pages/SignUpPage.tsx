import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui";
import { AuthForm } from "../components/AuthForm";
import { useSignUp } from "../hooks/useSignUp";

const initialValues = {
  id: "",
  name: "",
  password: "",
};

export const SignUpPage = () => {
  const [values, setValues] = useState(initialValues);
  const signUp = useSignUp();
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof initialValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signUp.mutate(
      {
        id: values.id.trim(),
        name: values.name.trim(),
        password: values.password,
      },
      {
        onSuccess: () => navigate("/signin", { replace: true }),
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <AuthForm
        errorMessage={signUp.error?.message}
        isPending={signUp.isPending}
        mode="signup"
        onChange={handleChange}
        onSubmit={handleSubmit}
        values={values}
      />
      <Button asChild variant="ghost">
        <Link to="/signin">로그인으로 이동</Link>
      </Button>
    </div>
  );
};
