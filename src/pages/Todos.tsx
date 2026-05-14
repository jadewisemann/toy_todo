import React, { useState } from "react";
import { useTodos, useAuth } from "../hooks";
import { Button, Input, Checkbox, Card } from "../components";

export const Todos = () => {
  const [title, setTitle] = useState("");
  const { tasks, isLoading, isError, createTask, updateTask, deleteTask, stats } = useTodos();
  const { user, signOut } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask(title.trim(), { onSuccess: () => setTitle("") });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* User Profile Section */}
        <Card>
          <Card.Content className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {user?.nickname?.[0] || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.nickname ?? "사용자"}님</p>
                <p className="text-sm text-gray-500">오늘도 힘내세요!</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              Sign Out
            </Button>
          </Card.Content>
        </Card>

        {/* Todo List Section */}
        <Card>
          <Card.Header>
            <div className="flex justify-between items-end">
              <div>
                <Card.Title className="text-2xl">Todo List</Card.Title>
                <Card.Description className="mt-1.5">
                  완료: {stats.completed} / 전체: {stats.total} ({stats.progress}%)
                </Card.Description>
              </div>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${stats.progress}%` }} 
                />
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="새로운 할 일을 입력하세요"
              />
              <Button type="submit">Add Task</Button>
            </form>

            {isLoading ? (
              <div className="animate-pulse py-8 text-center text-gray-500">Loading tasks...</div>
            ) : isError ? (
              <div className="py-8 text-center text-red-500">Failed to load tasks.</div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p>할 일이 없습니다. 첫 번째 할 일을 추가해보세요!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li 
                    key={task.id} 
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                      task.is_completed ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white hover:border-blue-200"
                    }`}
                  >
                    <Checkbox 
                      checked={task.is_completed}
                      onChange={(e) => updateTask({ id: task.id, data: { is_completed: e.target.checked } })}
                    />
                    <span className={`flex-1 text-sm text-gray-800 ${task.is_completed ? "line-through" : ""}`}>
                      {task.title}
                    </span>
                    <button 
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      <span className="sr-only">Delete</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};
