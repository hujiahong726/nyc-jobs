const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";


export class ApiError extends Error {
    status: number;
    body?: unknown;
    constructor(message: string, status: number, body?: unknown) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    const text = await res.text();
    let body: unknown = undefined;
    try {
        body = text ? JSON.parse(text) : undefined;
    } catch {
        body = text;
    }

    if (!res.ok) {
        const msg = 
            (body as any)?.detail ||
            (body as any)?.error ||
            `Request failed (${res.status})`;
        throw new ApiError(msg, res.status, body);
    }
    return body as T;
}

