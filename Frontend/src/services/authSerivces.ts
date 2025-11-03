// authService.ts (or .js)
import axios from "axios";

// or your actual backend

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
export async function signUp(username: string, password: string) {
  // POST to /api/v1/signup
  const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
    username,
    password
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token
  }
  return response.data; // e.g., { message: "User signed up" }
}

export async function signIn(username: string, password: string) {
  const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
    username,
    password
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token
  }

  return response.data;
}

export async function signInWithGoogle() {
  // Redirect to Google OAuth
  window.location.href = `${BACKEND_URL}/auth/google`;
}