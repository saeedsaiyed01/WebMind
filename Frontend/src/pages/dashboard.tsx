import axios from "axios";
import { Delete, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddContentCard } from "../components/ui/AddContentCard";
import LLMChatModal from "../components/ui/AiChatModal";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import Navbar from "../components/ui/NavBar";
import { CardSkeleton } from "../components/ui/skelenton";
import { useContent } from "../hooks/useContent";
import Ailogo from "../icons/Ailogo";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
type ContentType = "note" | "tweet" | "document" | "website";

interface ContentItem {
  _id: string;
  title: string;
  link: string;
  originalLink?: string;
  type: ContentType;
  timestamp?: string;
}

export function Dashboard() {
  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [aiChatModalOpen, setAiChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
 const { contents, refresh, loading } = useContent(); // ✅ updated
  

  useEffect(() => {
    refresh();
  }, [addContentModalOpen]);

  const filteredContents = contents.filter((item: ContentItem) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/chat`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const { answer } = response.data;
      return answer;
    } catch (error) {
      console.error("Error generating response:", error);
      return "An error occurred while generating the response.";
    }
  };

  async function handleTitleChange(id: string, newTitle: string) {
    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(
        `${BACKEND_URL}/content`,
        { contentId: id, newTitle, newContent: "" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      refresh();
    } catch (error) {
      console.error("Error updating title:", error);
    
      toast.success("Failed to update title. Please try again..", {
        icon: <Delete className="w-5 h-5 text-red-500" />,
      });
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("token") || "";
    try {
      await axios.delete(`${BACKEND_URL}/content`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        data: { contentId: id },
      });
      refresh();
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (status === 404 || message === "Content not found or unauthorized") {
        console.warn("Content already deleted or not owned by user.");
        refresh();
        return;
      }
      console.error("Error deleting content:", error);
      // alert("Failed to delete content. Please try again.");
      toast.success("Failed to delete content.", {
        icon: <Delete className="w-5 h-5 text-red-500" />,
      });
    }
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-20 container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Dashboard</h1>
          <div className="flex gap-4">
            
            <Button
              size="md"
              onClick={() => setAiChatModalOpen(true)}
              variant="orange"
              text="Ai Search"
              startIcon={<Ailogo />}
            />
            <Button
              size="md"
              onClick={() => setAddContentModalOpen(true)}
              variant="orange"
              text="Add Content"
              startIcon={<PlusIcon />}
            />
          </div>
        </div>

        <LLMChatModal
          isOpen={aiChatModalOpen}
          onClose={() => setAiChatModalOpen(false)}
          onSendMessage={handleSendMessage}
        />

        <CreateContentModal
          onOpen={addContentModalOpen}
          onClose={() => setAddContentModalOpen(false)}
          onContentAdded={refresh}
        />

     <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-4">
  <div className="break-inside-avoid">
    <AddContentCard onClick={() => setAddContentModalOpen(true)} />
  </div>

  {loading ? (
    // Show 6 skeletons while loading
    Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
  ) : (
    (searchQuery ? filteredContents : contents).map((item: ContentItem) => (
      <Card
        id={item._id}
        key={item._id}
        type={item.type}
        title={item.title}
        link={item.type === "note" ? "" : item.link}
        originalLink={item.type === "tweet" ? item.originalLink : ""}
        notes={item.type === "note" ? item.link : ""}
        onTitleChange={(newTitle) => handleTitleChange(item._id, newTitle)}
        onDelete={() => handleDelete(item._id)}
      />
    ))
  )}
</div>

        
      </div>
    </div>
  );
}
