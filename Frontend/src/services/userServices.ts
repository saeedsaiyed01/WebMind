  // userServices.ts
  import axios from "axios";


export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  export async function onSendMessage(message: string, contentId: string): Promise<string> {
    const token = localStorage.getItem("token") || "";

    const response = await axios.post(
      `${BACKEND_URL}/chat`,
      {
        message,
        contentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return response.data.answer;
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
