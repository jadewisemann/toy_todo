import { http, HttpResponse } from "msw";
import { mockTasks, mockUsers } from "./data";

const generateToken = (userId: string) => `mock_jwt_token_${userId}`;
const getUserIdFromToken = (token: string | null) => {
  if (!token || !token.startsWith("Bearer mock_jwt_token_")) return null;
  return token.replace("Bearer mock_jwt_token_", "");
};

const requireUser = (request: Request) => {
  const token = request.headers.get("Authorization");
  const userId = getUserIdFromToken(token);
  const user = userId ? mockUsers.find((u) => u.id === userId) : null;

  if (!user) {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return user;
};

export const handlers = [
  http.get("/api/auth/me", ({ request }) => {
    const user = requireUser(request);
    if (user instanceof HttpResponse) return user;

    return HttpResponse.json({
      user: {
        id: user.id,
        name: user.name,
      },
    });
  }),

  http.post("/api/auth/signin", async ({ request }) => {
    const body = (await request.json()) as { id?: string; password?: string };
    const user = mockUsers.find(
      (mockUser) =>
        mockUser.id === body.id && mockUser.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: generateToken(user.id),
      user: {
        id: user.id,
        name: user.name,
      },
    });
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      id?: string;
      name?: string;
      password?: string;
    };

    if (!body.id || !body.name || !body.password) {
      return HttpResponse.json(
        { message: "필수 값을 입력하세요." },
        { status: 400 },
      );
    }

    if (mockUsers.some((user) => user.id === body.id)) {
      return HttpResponse.json(
        { message: "이미 존재하는 아이디입니다." },
        { status: 409 },
      );
    }

    mockUsers.push({
      id: body.id,
      name: body.name,
      password: body.password,
    });

    return HttpResponse.json(
      {
        token: generateToken(body.id),
        user: {
          id: body.id,
          name: body.name,
        },
      },
      { status: 201 },
    );
  }),

  http.post("/api/auth/signout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/todos", ({ request }) => {
    const user = requireUser(request);
    if (user instanceof HttpResponse) return user;

    return HttpResponse.json({
      todos: mockTasks.map(toTodoResponse),
    });
  }),

  http.post("/api/todos", async ({ request }) => {
    const user = requireUser(request);
    if (user instanceof HttpResponse) return user;

    const body = (await request.json()) as { title?: string };
    const title = body.title?.trim();

    if (!title) {
      return HttpResponse.json(
        { message: "할 일 제목을 입력하세요." },
        { status: 400 },
      );
    }

    const task = {
      id: `todo_${Date.now()}`,
      title,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    mockTasks.unshift(task);

    return HttpResponse.json({ todo: toTodoResponse(task) }, { status: 201 });
  }),

  http.patch("/api/todos/:id", async ({ params, request }) => {
    const user = requireUser(request);
    if (user instanceof HttpResponse) return user;

    const task = mockTasks.find((item) => String(item.id) === params.id);

    if (!task) {
      return HttpResponse.json(
        { message: "Todo를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      completed?: boolean;
      is_completed?: boolean;
      title?: string;
    };

    if (typeof body.title === "string") {
      task.title = body.title;
    }

    if (typeof body.completed === "boolean") {
      task.is_completed = body.completed;
    } else if (typeof body.is_completed === "boolean") {
      task.is_completed = body.is_completed;
    }

    return HttpResponse.json({ todo: toTodoResponse(task) });
  }),

  http.delete("/api/todos/:id", ({ params, request }) => {
    const user = requireUser(request);
    if (user instanceof HttpResponse) return user;

    const index = mockTasks.findIndex((item) => String(item.id) === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Todo를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    mockTasks.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];

const toTodoResponse = (task: (typeof mockTasks)[number]) => ({
  id: String(task.id),
  title: task.title,
  completed: task.is_completed,
  createdAt: task.created_at,
  updatedAt: task.created_at,
});
