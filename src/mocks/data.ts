import type { User } from "@/features/auth/types";
import type { Task } from "@/features/todos/types";

export const mockUsers: Array<User & { password: string }> = [
  {
    id: "user01",
    name: "홍길동",
    password: "password123",
  },
];

export const mockTasks: Task[] = [
  {
    id: "todo_1",
    title: "로그인 페이지 만들기",
    is_completed: true,
    created_at: new Date("2026-05-13T07:10:00.000Z").toISOString(),
  },
  {
    id: "todo_2",
    title: "MSW로 API 흐름 검증하기",
    is_completed: false,
    created_at: new Date("2026-05-13T07:20:00.000Z").toISOString(),
  },
];
