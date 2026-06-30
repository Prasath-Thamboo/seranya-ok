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

export default function AdminDiscussionsPage() {
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
    <div className="p-6 min-h-screen bg-black text-white font-kanit">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FiMessageCircle className="w-6 h-6 text-green-400" />
        <div>
          <h1 className="text-2xl font-iceberg uppercase tracking-widest text-white">Discussions</h1>
          <p className="text-gray-500 text-sm mt-0.5">
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
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse bg-gray-900/40 rounded-xl h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-16">Aucun commentaire trouvé.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500 w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500">Auteur</th>
                <th className="text-left px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500">Commentaire</th>
                <th className="text-left px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500">Ressource</th>
                <th className="text-left px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500">Date</th>
                <th className="px-4 py-3 text-xs font-iceberg uppercase tracking-widest text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comment) => {
                const resource = resourceLabel(comment);
                return (
                  <tr
                    key={comment.id}
                    className="border-b border-gray-800/60 hover:bg-gray-900/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-600 text-xs">{comment.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-xs font-iceberg">
                            {comment.user.pseudo.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-xs font-iceberg">{comment.user.pseudo}</p>
                          <p className="text-gray-600 text-xs capitalize">{comment.user.role.toLowerCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
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
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 self-start mb-1 font-iceberg uppercase tracking-widest">
                          {resource.label}
                        </span>
                        <span className="text-gray-300 text-xs hover:text-green-400 transition-colors line-clamp-1">
                          {resource.title}
                        </span>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
