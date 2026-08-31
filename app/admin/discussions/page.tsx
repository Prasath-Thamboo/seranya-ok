"use client";

import { useEffect, useState } from "react";
import { fetchAllComments, deleteComment } from "@/lib/queries/CommentQueries";
import { CommentModel } from "@/lib/models/CommentModels";
import { useNotification } from "@/components/notifications/NotificationProvider";
import { FiTrash2, FiMessageCircle, FiSearch } from "react-icons/fi";

const resourceLabel = (comment: CommentModel) => {
  if (comment.post) return { label: "Post", title: comment.post.title, href: `/posts/${comment.post.id}` };
  if (comment.unit) return { label: "Unité", title: comment.unit.title, href: `/univers/units/${comment.unit.id}` };
  if (comment.class) return { label: "Classe", title: comment.class.title, href: `/univers/classes/${comment.class.id}` };
  if (comment.tutorial) return { label: "Tutoriel", title: comment.tutorial.title, href: "#" };
  return { label: "—", title: "—", href: "#" };
};

function DiscussionsContent() {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchAllComments()
      .then(setComments)
      .catch(() => addNotification("critical", "Erreur lors du chargement des commentaires."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce commentaire ?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      addNotification("success", "Commentaire supprimé.");
    } catch {
      addNotification("critical", "Erreur lors de la suppression.");
    }
  };

  const filtered = comments.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.content.toLowerCase().includes(q) ||
      c.user.pseudo.toLowerCase().includes(q) ||
      (c.post?.title ?? c.unit?.title ?? c.class?.title ?? c.tutorial?.title ?? "").toLowerCase().includes(q)
    );
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="p-2 font-sans text-ink">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FiMessageCircle className="w-6 h-6 text-accent" />
        <div>
          <h1 className="text-2xl font-serif font-medium text-ink">Discussions</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            {comments.length} commentaire{comments.length !== 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par contenu, auteur ou ressource..."
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-raised border border-line text-ink text-sm placeholder-ink-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted w-4 h-4" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse bg-sunken rounded-xl h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-ink-muted text-sm text-center py-16">Aucun commentaire trouvé.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-raised">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-sunken">
                <th className="text-left px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted">Auteur</th>
                <th className="text-left px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted">Commentaire</th>
                <th className="text-left px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted">Ressource</th>
                <th className="text-left px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted">Date</th>
                <th className="px-4 py-3 text-xs font-sans uppercase tracking-[0.12em] text-ink-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comment) => {
                const resource = resourceLabel(comment);
                return (
                  <tr
                    key={comment.id}
                    className="border-b border-line/60 hover:bg-sunken transition-colors"
                  >
                    <td className="px-4 py-3 text-ink-muted text-xs">{comment.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent text-xs font-serif">
                            {comment.user.pseudo.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-ink text-xs font-serif">{comment.user.pseudo}</p>
                          <p className="text-ink-muted text-xs capitalize">{comment.user.role.toLowerCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-ink-soft text-xs line-clamp-2 leading-relaxed">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col"
                      >
                        <span className="text-xs px-1.5 py-0.5 rounded bg-sunken text-ink-soft self-start mb-1 font-sans uppercase tracking-[0.12em]">
                          {resource.label}
                        </span>
                        <span className="text-ink-soft text-xs hover:text-accent transition-colors line-clamp-1">
                          {resource.title}
                        </span>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-xs whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDiscussionsPage() {
  return <DiscussionsContent />;
}
