// authService.ts (or .js)
import axios from "axios";
import { BACKEND_URL } from "../config";
// or your actual backend

export async function signUp(username: string, password: string) {
  // POST to /api/v1/signup
  const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
    username,
    password
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token
  }
  return response.data; // e.g., { message: "User signed up" }
}

export async function signIn(username: string, password: string) {
  const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
    username,
    password
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token
  }

  return response.data;
}