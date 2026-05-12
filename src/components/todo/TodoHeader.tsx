import {
  Badge,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { TaskStats } from "@/types/task";

type TodoHeaderProps = {
  stats: TaskStats;
};

export const TodoHeader = ({ stats }: TodoHeaderProps) => (
  <CardHeader>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <CardTitle>Todo</CardTitle>
        <CardDescription>
          Django REST API와 연결되는 최소 태스크 관리 앱
        </CardDescription>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">전체 {stats.total}</Badge>
        <Badge variant="secondary">완료 {stats.completed}</Badge>
        <Badge variant="outline">남은 일 {stats.remaining}</Badge>
      </div>
    </div>
  </CardHeader>
);
