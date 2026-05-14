import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest } from "../api";

// Mock the globalThis fetch
globalThis.fetch = vi.fn() as any;

describe("API utility - apiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should make a request with credentials: 'include'", async () => {
    const mockResponse = { ok: true, status: 200, text: vi.fn().mockResolvedValue('{"foo":"bar"}'), headers: new Headers() };
    (globalThis.fetch as any).mockResolvedValue(mockResponse);

    const data = await apiRequest<{ foo: string }>("/test");

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      credentials: "include",
    }));
    expect(data).toEqual({ foo: "bar" });
  });

  it("should throw an error if response is not ok", async () => {
    const mockResponse = { ok: false, status: 400, text: vi.fn().mockResolvedValue('{"detail":"Bad Request"}'), headers: new Headers() };
    (globalThis.fetch as any).mockResolvedValue(mockResponse);

    await expect(apiRequest("/test")).rejects.toThrow("Bad Request");
  });

  it("should return null for 204 No Content", async () => {
    const mockResponse = { ok: true, status: 204, text: vi.fn(), headers: new Headers() };
    (globalThis.fetch as any).mockResolvedValue(mockResponse);

    const data = await apiRequest("/test");
    expect(data).toBeNull();
  });
});
