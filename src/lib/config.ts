// src/lib/config.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://byd-harmony-backend.vercel.app";

export const API_URL = `${API_BASE_URL}/api/v1`;
