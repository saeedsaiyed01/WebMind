import axios from "axios";

export { BACKEND_URL } from "@/config";
import { BACKEND_URL } from "@/config";
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