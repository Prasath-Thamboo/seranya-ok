"use client";

import { useState, useEffect } from "react";
import { FiSend, FiEdit2, FiTrash2, FiX, FiCheck, FiMessageCircle } from "react-icons/fi";
import { CommentModel } from "@/lib/models/CommentModels";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/queries/CommentQueries";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { getAccessToken } from "@/lib/queries/AuthQueries";
import { useNotification } from "@/components/notifications/NotificationProvider";

interface Props {
  postId?: number;
  unitId?: number;
  classId?: string;
  tutorialId?: number;
}

export default function CommentSection({ postId, unitId, classId, tutorialId }: Props) {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((u) => { setCurrentUserId(u.id); setIsLoggedIn(true); })
        .catch(() => setIsLoggedIn(false));
    }

    fetchComments({ postId, unitId, classId, tutorialId })
      .then(setComments)
      .catch(() => addNotification("critical", "Erreur lors du chargement des commentaires."))
      .finally(() => setLoading(false));
  }, [postId, unitId, classId, tutorialId]);

  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      const created = await createComment({ content: newContent.trim(), postId, unitId, classId, tutorialId });
      setComments((prev) => [created, ...prev]);
      setNewContent("");
    } catch {
      addNotification("critical", "Erreur lors de l'envoi du commentaire.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id: number) => {
    if (!editContent.trim()) return;
    try {
      const updated = await updateComment(id, { content: editContent.trim() });
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch {
      addNotification("critical", "Erreur lors de la modification.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      addNotification("critical", "Erreur lors de la suppression.");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <section className="mt-16 border-t border-gray-800 pt-10">
      <div className="flex items-center gap-3 mb-8">
        <FiMessageCircle className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-iceberg uppercase tracking-widest text-white">
          Discussions
          {comments.length > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-kanit normal-case tracking-normal">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Zone de saisie */}
      {isLoggedIn ? (
        <div className="mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Partagez votre avis..."
            rows={3}
            className="w-full bg-transparent text-gray-200 font-kanit text-sm placeholder-gray-600 resize-none focus:outline-none"
            maxLength={2000}
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <span className="text-gray-600 font-kanit text-xs">{newContent.length}/2000</span>
            <button
              onClick={handleSubmit}
              disabled={submitting || !newContent.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 disabled:opacity-40 text-white text-xs font-iceberg uppercase tracking-widest rounded-lg transition-all"
            >
              <FiSend className="w-3.5 h-3.5" />
              {submitting ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-gray-900/30 border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-gray-500 font-kanit text-sm">
            <a href="/auth/login" className="text-green-400 hover:text-green-300 transition-colors">
              Connectez-vous
            </a>{" "}
            pour laisser un commentaire.
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-900/40 rounded-xl h-20" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-600 font-kanit text-sm text-center py-8">
          Aucun commentaire pour le moment. Soyez le premier !
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-4"
            >
              {/* Header commentaire */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400 font-iceberg text-sm">
                      {comment.user.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white font-iceberg text-sm">{comment.user.pseudo}</span>
                    <p className="text-gray-600 font-kanit text-xs">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>

                {/* Actions (propriétaire) */}
                {currentUserId === comment.userId && editingId !== comment.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                      className="p-1.5 text-gray-600 hover:text-green-400 transition-colors rounded-lg hover:bg-green-500/10"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Contenu / Edition */}
              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg p-3 text-gray-200 font-kanit text-sm resize-none focus:outline-none focus:border-green-500/50"
                    maxLength={2000}
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-iceberg uppercase text-gray-400 border border-gray-700 rounded-lg hover:text-white transition-colors"
                    >
                      <FiX className="w-3 h-3" /> Annuler
                    </button>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-iceberg uppercase text-green-400 border border-green-500/40 rounded-lg hover:bg-green-500/10 transition-colors"
                    >
                      <FiCheck className="w-3 h-3" /> Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 font-kanit text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
