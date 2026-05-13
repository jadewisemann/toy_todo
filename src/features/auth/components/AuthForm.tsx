import { Loader2, LogIn, UserPlus } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

type AuthFormValues = {
  id: string;
  name: string;
  password: string;
};

type AuthFormProps = {
  errorMessage?: string;
  isPending: boolean;
  mode: "signin" | "signup";
  onChange: (field: keyof AuthFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  values: AuthFormValues;
};

export const AuthForm = ({
  errorMessage,
  isPending,
  mode,
  onChange,
  onSubmit,
  values,
}: AuthFormProps) => {
  const isSignUp = mode === "signup";
  const Icon = isSignUp ? UserPlus : LogIn;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{isSignUp ? "회원가입" : "로그인"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Input
            autoComplete="username"
            disabled={isPending}
            maxLength={40}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange("id", event.target.value)
            }
            placeholder="아이디"
            required
            value={values.id}
          />
          {isSignUp ? (
            <Input
              autoComplete="name"
              disabled={isPending}
              maxLength={40}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange("name", event.target.value)
              }
              placeholder="이름"
              required
              value={values.name}
            />
          ) : null}
          <Input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            disabled={isPending}
            minLength={6}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange("password", event.target.value)
            }
            placeholder="비밀번호"
            required
            type="password"
            value={values.password}
          />
          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icon className="mr-2 h-4 w-4" />
            )}
            {isSignUp ? "가입하기" : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
