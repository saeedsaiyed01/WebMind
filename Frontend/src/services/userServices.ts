  // userServices.ts
  import axios from "axios";
  import { type ChatPhase, readChatStream } from "../lib/chatStream";


export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://web-mind-be.vercel.app/api/v1";

  export async function onSendMessage(
    message: string,
    contentId: string,
    onPhase?: (phase: ChatPhase) => void,
  ): Promise<string> {
    const token = localStorage.getItem("token") || "";

    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        message,
        contentId,
      }),
    });

    const result = await readChatStream(response, onPhase);
    return result.answer;
  }


  //  Update content
  export async function updateContent(
    contentId: string,
    newTitle: string,
    newContent: string
  ): Promise<any> {
    const token = localStorage.getItem("token") || "";

    const response = await axios.put(
      `${BACKEND_URL}/content`,
      {
        contentId,
        newTitle,
        newContent,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  }

  //  Delete content
  export  async function deleteContent(contentId: string): Promise<any> {
    const token = localStorage.getItem("token") || "";

    const response = await axios.delete(`${BACKEND_URL}/content`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      data: {
        contentId,
      },
    });

    return response.data;
  }
