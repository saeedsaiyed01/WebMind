import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://web-mind-be.vercel.app/api/v1";
export async function UserDetails() {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user details", error);
    return null;
  }
}