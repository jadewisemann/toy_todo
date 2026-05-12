import { Trash2 } from "lucide-react";
import { Button, Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";

export const TodoItem = ({ deleteTask, isMutating, task, toggleTask }) => (
  <li className="flex min-h-14 items-center gap-3 rounded-md border bg-background px-3 py-2">
    <Checkbox
      aria-label={`${task.title} 완료 상태 변경`}
      checked={task.is_completed}
      disabled={isMutating}
      onCheckedChange={(checked) =>
        toggleTask.mutate({
          id: task.id,
          isCompleted: Boolean(checked),
        })
      }
    />
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          "break-words text-sm font-medium leading-6",
          task.is_completed && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatCreatedAt(task.created_at)}
      </p>
    </div>
    <Button
      aria-label={`${task.title} 삭제`}
      disabled={isMutating}
      onClick={() => deleteTask.mutate(task.id)}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </li>
);

const formatCreatedAt = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};
