// authService.ts (or .js)
import axios from "axios";
import { useStore } from "@/store/useStore";

// or your actual backend

export { BACKEND_URL } from "@/config";
import { BACKEND_URL } from "@/config";
export async function signUp(username: string, password: string) {
  // POST to /api/v1/signup
  const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
    username,
    password
  });
  if (response.data.token) {
    useStore.getState().setToken(response.data.token);
  }
  return response.data; // e.g., { message: "User signed up" }
}

export async function signIn(username: string, password: string) {
  const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
    username,
    password
  });

  if (response.data.token) {
    useStore.getState().setToken(response.data.token);
  }

  return response.data;
}

export async function signInWithGoogle() {
  // Redirect to Google OAuth
  window.location.href = `${BACKEND_URL}/auth/google`;
}
