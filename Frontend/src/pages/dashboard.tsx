import { ContentCard } from "@/components/ContentCard";
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { AlertCircle, FileText, Filter, LayoutGrid, Link as LinkIcon, Plus, StickyNote, Twitter, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { DeleteConfirmationModal } from "../components/ui/DeleteConfirmationModal";
import { useContent } from "../hooks/useContent";

export function Dashboard() {
  const { contents, refresh, deleteContent, updateContent } = useContent();
  const { credits } = useStore(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Filter State
  const [filter, setFilter] = useState<"all" | "link" | "tweet" | "note" | "document">("all");

  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Derived State: Filtered Contents
  const filteredContents = contents.filter((item: any) => {
    if (filter === "all") return true;
    if (filter === "link") return item.type === "link" || item.type === "website" || item.type === "video";
    return item.type === filter;
  });

  // Edit Handlers
  const handleEdit = (item: any) => {
    // This handler opens the modal (Full Edit). 
    // We can keep it or use inline edit from Content Card. 
    // The ContentCard will separate "Quick Edit" (Inline) via Internal State.
    // If we want the "Edit" button on card to ONLY do inline, we pass logic there.
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  // Inline Update Handler passed to Card
  const handleUpdate = async (id: string, newTitle: string) => {
     try {
        await updateContent(id, newTitle);
        toast.success("Title updated.");
     } catch (e) {
        toast.error("Failed to update title.");
     }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Delete Handlers
  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      setIsDeleting(true);
      await deleteContent(deleteId);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const FilterChip = ({ label, value, icon: Icon }: { label: string, value: typeof filter, icon: any }) => (
     <button
        onClick={() => setFilter(value)}
        className={cn(
           "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 border",
           filter === value 
              ? "bg-zinc-100 text-zinc-900 border-zinc-100 shadow-sm" 
              : "bg-transparent text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300"
        )}
     >
        <Icon className="h-3.5 w-3.5" />
        {label}
     </button>
  );

  return (
    <DashboardLayout>
      <SEO title="Dashboard — WebMind" noindex={true} />
      <div className="h-full w-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-8 p-6 md:p-10 max-w-[1600px] mx-auto pb-20">
            
            {/* Header */}
            {/* Header with Compact Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
                  <p className="text-zinc-500 text-sm font-medium">Overview of your digital brain.</p>
              </div>
              
              <div className="flex items-center gap-3">
                 {/* Compact Stat: Saved */}
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0C0C0C] border border-white/10 rounded-full shadow-sm">
                    <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-white font-bold text-sm font-sans">{contents.length}</span>
                    <span className="text-xs text-zinc-500 hidden sm:inline font-medium">Saved</span>
                 </div>

                 {/* Compact Stat: Credits */}
                 <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors shadow-sm",
                    credits < 0 ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                 )}>
                    {credits < 0 ? <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> : <Zap className="h-3.5 w-3.5 text-emerald-400" />}
                    <span className={cn("font-bold text-sm font-sans", credits < 0 ? "text-rose-500" : "text-emerald-400")}>{credits}</span>
                    <span className={cn("text-xs hidden sm:inline font-medium", credits < 0 ? "text-rose-500/70" : "text-emerald-400/70")}>Credits</span>
                 </div>

                 <Button 
                     onClick={handleAddNew} 
                     className="bg-white/5 border border-white/10 hover:bg-white/10 text-white active:scale-[0.98] transition-all h-9 px-4 rounded-full font-medium backdrop-blur-sm ml-2 text-xs"
                 >
                   <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Content
                 </Button>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6 pt-4">
                
                {/* Filter Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-linear-fade">
                   <FilterChip label="All View" value="all" icon={LayoutGrid} />
                   <div className="h-4 w-px bg-white/10 mx-2" />
                   <FilterChip label="Tweets" value="tweet" icon={Twitter} />
                   <FilterChip label="Links" value="link" icon={LinkIcon} />
                   <FilterChip label="Notes" value="note" icon={StickyNote} />
                   <FilterChip label="Docs" value="document" icon={FileText} />
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-20 px-1">
                  {filteredContents.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-24 border border-dashed border-white/10 rounded-3xl text-zinc-500 break-inside-avoid bg-[#0C0C0C]/50">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center mb-4 border border-white/5">
                          <Filter className="h-8 w-8 text-zinc-700" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-300 mb-1">No content found</h3>
                        <p className="text-sm">No items match the selected filter.</p>
                       {/* Clear Filters Logic */}
                        {filter !== 'all' && (
                           <Button onClick={() => setFilter('all')} variant="link" className="mt-2 text-zinc-400 hover:text-white">
                              Clear Filters
                           </Button>
                        )}
                    </div>
                  ) : (
                    filteredContents.map((item: any) => (
                        <div key={item._id} className="break-inside-avoid mb-6">
                            {/* Pass onUpdate handler directly */}
                          <ContentCard 
                            item={item} 
                            onDelete={handleDeleteRequest} 
                            onEdit={handleEdit}  // Can still be used for Modal fallback if needed
                            onUpdate={handleUpdate} // INLINE UPDATE HANDLER
                          />
                        </div>
                    ))
                  )}
                </div>
            </div>
          </div>
      </div>

      <CreateContentModal 
        onOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onContentAdded={refresh} 
        initialData={editingItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}
