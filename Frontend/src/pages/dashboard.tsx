import { ContentCard } from "@/components/ContentCard";
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { AlertCircle, FileText, LayoutGrid, Link as LinkIcon, Plus, Sparkles, StickyNote, Twitter, Zap } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { DeleteConfirmationModal } from "../components/ui/DeleteConfirmationModal";
import { motion } from "framer-motion";
import { useContent } from "../hooks/useContent";

export function Dashboard() {
  const { contents, refresh, deleteContent, updateContent } = useContent();
  const { credits } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "link" | "tweet" | "note" | "document">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredContents = contents.filter((item: any) => {
    if (filter === "all") return true;
    if (filter === "link") return item.type === "link" || item.type === "website" || item.type === "video";
    return item.type === filter;
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

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

  const FilterChip = ({
    label,
    shortLabel,
    value,
    icon: Icon,
  }: {
    label: string;
    shortLabel?: string;
    value: typeof filter;
    icon: ComponentType<{ className?: string }>;
  }) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      title={label}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-all active:scale-[0.98] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[13px]",
        filter === value
          ? "border-white/40 bg-white/10 text-white"
          : "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
      <span className="leading-none">
        <span className="sm:hidden">{shortLabel ?? label}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
    </button>
  );

  return (
    <DashboardLayout>
      <SEO title="Dashboard — WebMind" noindex={true} />
      <div className="no-scrollbar h-full w-full min-w-0 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] space-y-8 p-6 pb-20 md:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Overview of your digital brain.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 shadow-soft">
                <LayoutGrid className="h-3.5 w-3.5 text-zinc-300" />
                <span className="font-sans text-sm font-bold text-foreground">{contents.length}</span>
                <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Saved</span>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-soft transition-colors",
                  credits < 0 ? "border-destructive/30 bg-destructive/10" : "border-zinc-700 bg-zinc-800/60"
                )}
              >
                {credits < 0 ? (
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                ) : (
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span className={cn("font-sans text-sm font-bold", credits < 0 ? "text-destructive" : "text-white")}>
                  {credits}
                </span>
                <span className={cn("hidden text-xs font-medium sm:inline", credits < 0 ? "text-destructive/70" : "text-zinc-400")}>
                  Credits
                </span>
              </div>

              <Button
                onClick={handleAddNew}
                className="ml-2 h-9 px-4 text-xs bg-white text-black font-semibold hover:bg-zinc-200"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Content
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 pt-4">
            <div className="relative border-b border-border pb-3">
              <div
                className="-mx-6 flex touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-1 no-scrollbar sm:mx-0 sm:px-0"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex w-max flex-nowrap items-center gap-2 md:gap-2.5">
                  <FilterChip label="All View" shortLabel="All" value="all" icon={LayoutGrid} />
                  <div className="hidden h-8 w-px shrink-0 self-center bg-border sm:block" aria-hidden />
                  <FilterChip label="Tweets" value="tweet" icon={Twitter} />
                  <FilterChip label="Links" value="link" icon={LinkIcon} />
                  <FilterChip label="Notes" value="note" icon={StickyNote} />
                  <FilterChip label="Docs" value="document" icon={FileText} />
                </div>
              </div>
            </div>

            <div className="columns-1 gap-6 space-y-6 px-1 pb-20 md:columns-2 lg:columns-3 xl:columns-4">
              {filteredContents.length === 0 ? (
                <div className="flex break-inside-avoid flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/40 p-24 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background/60">
                    <Sparkles className="h-8 w-8 text-zinc-400" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-foreground">No content found</h3>
                  <p className="text-sm text-muted-foreground">No items match the selected filter.</p>
                  {filter !== "all" && (
                    <Button onClick={() => setFilter("all")} variant="link" className="mt-2 text-muted-foreground hover:text-white">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredContents.map((item: any, idx: number) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                    className="break-inside-avoid mb-6"
                  >
                    <ContentCard
                      item={item}
                      onDelete={handleDeleteRequest}
                      onEdit={handleEdit}
                      onUpdate={handleUpdate}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateContentModal onOpen={isModalOpen} onClose={handleCloseModal} onContentAdded={refresh} initialData={editingItem} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}
