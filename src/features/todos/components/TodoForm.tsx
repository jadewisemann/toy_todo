import { Loader2, Plus } from "lucide-react";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { Button, Input } from "@/components/ui";

type TodoFormProps = {
  isCreating: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setTitle: Dispatch<SetStateAction<string>>;
  title: string;
};

export const TodoForm = ({
  isCreating,
  onSubmit,
  setTitle,
  title,
}: TodoFormProps) => (
  <form className="flex gap-2" onSubmit={onSubmit}>
    <Input
      aria-label="할 일 제목"
      disabled={isCreating}
      maxLength={200}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setTitle(event.target.value)
      }
      placeholder="할 일을 입력하세요"
      value={title}
    />
    <Button disabled={isCreating || !title.trim()} type="submit">
      {isCreating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      추가
    </Button>
  </form>
);
