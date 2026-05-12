import { Loader2, Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";

export const TodoForm = ({ isCreating, onSubmit, setTitle, title }) => (
  <form className="flex gap-2" onSubmit={onSubmit}>
    <Input
      aria-label="할 일 제목"
      disabled={isCreating}
      maxLength={200}
      onChange={(event) => setTitle(event.target.value)}
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
