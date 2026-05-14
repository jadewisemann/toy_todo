import { http, HttpResponse } from "msw";

export type MockUser = {
  username: string;
  password?: string;
  nickname: string;
  email: string;
};

export const mockUsers: MockUser[] = [
  {
    username: "testuser",
    password: "testpass123",
    nickname: "테스터",
    email: "test@example.com",
  },
];

export const mockTasks = [
  {
    id: 1,
    title: "DRF 공부하기",
    is_completed: false,
    created_at: "2026-05-13T08:10:00Z",
  },
];

let isLoggedIn = false;

const requireUser = () => {
  if (!isLoggedIn) {
    return HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 });
  }
  return mockUsers[0];
};

export const handlers = [
  http.get("/api/accounts/me/", () => {
    const user = requireUser();
    if (user instanceof HttpResponse) return user;

    return HttpResponse.json({
      username: user.username,
      nickname: user.nickname,
      email: user.email,
    });
  }),

  http.post("/api/accounts/login/", async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string };
    const user = mockUsers.find(
      (mockUser) =>
        mockUser.username === body.username && mockUser.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        { detail: "Invalid credentials" },
        { status: 401 },
      );
    }

    isLoggedIn = true;
    return HttpResponse.json({ message: "login success" });
  }),

  http.post("/api/accounts/register/", async ({ request }) => {
    const body = (await request.json()) as MockUser;

    if (!body.username || !body.password || !body.nickname || !body.email) {
      return HttpResponse.json(
        { message: "필수 값을 입력하세요." },
        { status: 400 },
      );
    }

    if (mockUsers.some((user) => user.username === body.username)) {
      return HttpResponse.json(
        { message: "이미 존재하는 사용자입니다." },
        { status: 400 },
      );
    }

    const newUser = {
      username: body.username,
      nickname: body.nickname,
      email: body.email,
      password: body.password,
    };
    mockUsers.push(newUser);

    return HttpResponse.json(
      {
        username: newUser.username,
        nickname: newUser.nickname,
        email: newUser.email,
      },
      { status: 201 },
    );
  }),

  http.post("/api/accounts/logout/", () => {
    isLoggedIn = false;
    return HttpResponse.json({ message: "logout success" });
  }),

  http.get("/api/todos/tasks/", () => {
    const user = requireUser();
    if (user instanceof HttpResponse) return user;

    return HttpResponse.json(mockTasks);
  }),

  http.post("/api/todos/tasks/", async ({ request }) => {
    const user = requireUser();
    if (user instanceof HttpResponse) return user;

    const body = (await request.json()) as { title?: string; is_completed?: boolean };
    const title = body.title?.trim();

    if (!title) {
      return HttpResponse.json(
        { message: "할 일 제목을 입력하세요." },
        { status: 400 },
      );
    }

    const task = {
      id: Date.now(),
      title,
      is_completed: body.is_completed ?? false,
      created_at: new Date().toISOString(),
    };

    mockTasks.unshift(task);

    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch("/api/todos/tasks/:id/", async ({ params, request }) => {
    const user = requireUser();
    if (user instanceof HttpResponse) return user;

    const task = mockTasks.find((item) => String(item.id) === params.id);

    if (!task) {
      return HttpResponse.json(
        { message: "Todo를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const body = (await request.json()) as {
      is_completed?: boolean;
    };

    if (typeof body.is_completed === "boolean") {
      task.is_completed = body.is_completed;
    }

    return HttpResponse.json(task);
  }),

  http.delete("/api/todos/tasks/:id/", ({ params }) => {
    const user = requireUser();
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
