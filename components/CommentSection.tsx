"use client";

import { useState, useEffect } from "react";
import { FiSend, FiEdit2, FiTrash2, FiX, FiCheck, FiMessageCircle } from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("comments");
  const tc = useTranslations("common");
  const locale = useLocale();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchCurrentUser()
        .then((u) => { setCurrentUserId(u.id); setIsLoggedIn(true); })
        .catch(() => setIsLoggedIn(false));
    }

    fetchComments({ postId, unitId, classId, tutorialId })
      .then(setComments)
      .catch(() => addNotification("critical", t("loadError")))
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
      addNotification("critical", t("createError"));
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
      addNotification("critical", t("updateError"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      addNotification("critical", t("deleteError"));
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="mb-8 flex items-center gap-3">
        <FiMessageCircle className="h-5 w-5 text-accent" />
        <h2 className="font-serif text-xl font-medium text-ink">
          {t("heading")}
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-sans text-ink-muted">({comments.length})</span>
          )}
        </h2>
      </div>

      {/* Zone de saisie */}
      {isLoggedIn ? (
        <div className="mb-8 rounded-2xl border border-line bg-raised p-4 shadow-sm">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={t("placeholder")}
            rows={3}
            className="w-full resize-none bg-transparent font-sans text-sm text-ink placeholder-ink-muted focus:outline-none"
            maxLength={2000}
          />
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="font-sans text-xs text-ink-muted">{newContent.length}/2000</span>
            <button
              onClick={handleSubmit}
              disabled={submitting || !newContent.trim()}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-sans text-ink-invert transition-all hover:bg-accent-hover disabled:opacity-40"
            >
              <FiSend className="h-3.5 w-3.5" />
              {submitting ? t("submitting") : t("submit")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-line bg-sunken p-5 text-center">
          <p className="font-sans text-sm text-ink-soft">
            {t.rich("loginPrompt", {
              link: (chunks) => (
                <Link
                  href="/auth/login"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-sunken" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center font-sans text-sm text-ink-muted">
          {t("empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-2xl border border-line bg-raised p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft">
                    <span className="font-serif text-sm text-accent">
                      {comment.user.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-sm text-ink">{comment.user.pseudo}</span>
                    <p className="font-sans text-xs text-ink-muted">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>

                {currentUserId === comment.userId && editingId !== comment.id && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                      className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent"
                      aria-label={t("editAria")}
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      aria-label={t("deleteAria")}
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-line bg-page p-3 font-sans text-sm text-ink focus:border-accent focus:outline-none"
                    maxLength={2000}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-sans text-ink-soft transition-colors hover:text-ink"
                    >
                      <FiX className="h-3 w-3" /> {tc("cancel")}
                    </button>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1.5 text-xs font-sans text-accent transition-colors hover:bg-accent-soft"
                    >
                      <FiCheck className="h-3 w-3" /> {tc("save")}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-soft">
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
