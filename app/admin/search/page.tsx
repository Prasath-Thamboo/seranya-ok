"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiSearch, FiFileText, FiPlay, FiBook, FiUsers,
  FiEdit, FiEye,
} from "react-icons/fi";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL;

interface SearchResults {
  posts:       { id: number; title: string; intro?: string; type?: string; isPublished: boolean; createdAt: string }[];
  tutorials:   { id: number; title: string; description?: string; isPublished: boolean; createdAt: string }[];
  definitions: { id: number; term: string; category?: string; isPublished: boolean; createdAt: string }[];
  users:       { id: number; pseudo: string; email: string; role: string; status?: string; createdAt: string }[];
}

const EMPTY: SearchResults = { posts: [], tutorials: [], definitions: [], users: [] };

const SECTIONS = [
  { key: "posts"       as const, label: "Articles",     icon: <FiFileText />, baseRoute: "admin/posts",       editRoute: (id: number | string) => `/admin/posts/update?id=${id}`,       viewRoute: (id: number | string) => `/posts/${id}`,              getTitle: (r: any) => r.title,  getSub: (r: any) => r.type },
  { key: "tutorials"   as const, label: "Tutoriels",    icon: <FiPlay />,      baseRoute: "admin/tutoriels",   editRoute: (id: number | string) => `/admin/tutoriels/update?id=${id}`,   viewRoute: null,                                                  getTitle: (r: any) => r.title,  getSub: (r: any) => r.description?.slice(0, 60) },
  { key: "definitions" as const, label: "Encyclopédie", icon: <FiBook />,      baseRoute: "admin/encyclopedie",editRoute: (id: number | string) => `/admin/encyclopedie/update?id=${id}`,viewRoute: null,                                                  getTitle: (r: any) => r.term,   getSub: (r: any) => r.category },
  { key: "users"       as const, label: "Utilisateurs", icon: <FiUsers />,     baseRoute: "admin/users",       editRoute: null,                                                           viewRoute: (id: number | string) => `/admin/users/${id}`,       getTitle: (r: any) => r.pseudo, getSub: (r: any) => r.email },
];

export default function AdminSearchPage() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SearchResults>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router                  = useRouter();
  const inputRef                = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults(EMPTY); setSearched(false); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await axios.get<SearchResults>(`${backendUrl}/search`, {
        params: { q: q.trim() },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(data);
      setSearched(true);
    } catch {
      setResults(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 400);
  };

  const totalResults = results.posts.length + results.tutorials.length + results.definitions.length + results.users.length;

  return (
    <div className="min-h-screen bg-black text-white font-kanit">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0">

        {/* Titre */}
        <div className="flex items-center gap-3 mb-6">
          <FiSearch className="w-5 h-5 text-green-400" />
          <h1 className="text-2xl font-iceberg uppercase tracking-widest">Recherche</h1>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Rechercher des articles, tutoriels, définitions, utilisateurs…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          )}
          {!loading && query && (
            <button
              onClick={() => { setQuery(""); setResults(EMPTY); setSearched(false); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* Etat initial */}
        {!searched && !loading && (
          <div className="text-center py-16 text-gray-600">
            <FiSearch className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Saisis au moins 2 caractères pour lancer la recherche.</p>
          </div>
        )}

        {/* Aucun résultat */}
        {searched && !loading && totalResults === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-sm">Aucun résultat pour <span className="text-gray-400">« {query} »</span>.</p>
          </div>
        )}

        {/* Résultats */}
        {searched && totalResults > 0 && (
          <div className="space-y-6">
            <p className="text-xs text-gray-500 font-iceberg uppercase tracking-widest">
              {totalResults} résultat{totalResults > 1 ? "s" : ""} pour <span className="text-green-400">« {query} »</span>
            </p>

            {SECTIONS.map((section) => {
              const items = results[section.key];
              if (items.length === 0) return null;
              return (
                <div key={section.key}>
                  {/* En-tête de section */}
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-800">
                    <span className="text-green-400 w-4">{section.icon}</span>
                    <span className="text-xs font-iceberg uppercase tracking-widest text-gray-400">{section.label}</span>
                    <span className="ml-auto text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{items.length}</span>
                  </div>

                  {/* Résultats */}
                  <div className="space-y-1">
                    {items.map((item: any) => {
                      const isUser = section.key === "users";
                      return (
                      <div
                        key={item.id}
                        onClick={isUser ? () => router.push(section.viewRoute!(item.id)) : undefined}
                        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-900 transition-colors group ${isUser ? "cursor-pointer" : ""}`}
                      >
                        {/* Statut publié */}
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.isPublished ?? true ? "bg-green-400" : "bg-gray-600"}`} />

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{section.getTitle(item)}</p>
                          {section.getSub(item) && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{section.getSub(item)}</p>
                          )}
                        </div>

                        {/* Date */}
                        <span className="text-xs text-gray-600 shrink-0 hidden sm:block">
                          {new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>

                        {/* Actions */}
                        {!isUser && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {section.viewRoute && (
                              <a
                                href={section.viewRoute(item.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Voir"
                                className="p-1.5 rounded-lg text-teal-500 hover:bg-teal-500/10 transition-colors"
                              >
                                <FiEye className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {section.editRoute && (
                              <button
                                onClick={() => router.push(section.editRoute!(item.id))}
                                title="Modifier"
                                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors"
                              >
                                <FiEdit className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
