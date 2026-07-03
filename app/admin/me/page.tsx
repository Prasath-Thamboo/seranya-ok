"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchCurrentUser } from '@/lib/queries/AuthQueries';
import { RegisterUserModel, UserRole } from '@/lib/models/AuthModels';
import { useNotification } from '@/components/notifications/NotificationProvider';
import {
  FiCamera, FiMail, FiShield, FiCalendar,
  FiUser, FiEdit3, FiCheck, FiX, FiAtSign,
} from 'react-icons/fi';

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL;

/* ── Validation pseudo (même logique que le backend) ── */
const BLOCKED_WORDS = [
  'connard','connasse','salope','pute','putain','enculé','encule','batard','bâtard',
  'fdp','niquer','nique','pede','pedale','pedalo','fiotte','tapette','gouine',
  'sexe','porno','porn','bite','couille','chatte','penis','hitler','nazi','negre',
  'fuck','shit','bitch','whore','slut','nigger','faggot','cunt','asshole',
];

function normalizePseudo(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function validatePseudoClient(pseudo: string): string | null {
  if (pseudo.length < 3)  return 'Minimum 3 caractères.';
  if (pseudo.length > 20) return 'Maximum 20 caractères.';
  if (!/^[a-zA-Z0-9]/.test(pseudo)) return 'Doit commencer par une lettre ou un chiffre.';
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(pseudo) && pseudo.length > 1)
    return 'Seuls lettres, chiffres, _ et - sont autorisés.';
  if (/__|--/.test(pseudo)) return 'Pas de _ ou - consécutifs.';
  const n = normalizePseudo(pseudo);
  if (BLOCKED_WORDS.some((w) => n.includes(normalizePseudo(w))))
    return 'Ce pseudo contient un terme non autorisé.';
  return null;
}

type PseudoStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

/* ── Page principale ── */
export default function ProfilePage() {
  const [user, setUser]                 = useState<RegisterUserModel | null>(null);
  const [previewSrc, setPreviewSrc]     = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [editLoading, setEditLoading]   = useState(false);
  const [activeTab, setActiveTab]       = useState<'info' | 'edit'>('info');
  const [editValues, setEditValues]     = useState({ name: '', lastName: '', pseudo: '' });
  const [pseudoStatus, setPseudoStatus] = useState<PseudoStatus>('idle');
  const [pseudoMsg, setPseudoMsg]       = useState('');
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router                          = useRouter();
  const { addNotification }             = useNotification();

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        setEditValues({ name: u.name || '', lastName: u.lastName || '', pseudo: u.pseudo || '' });
      })
      .catch(() => router.push('/auth/login'));
  }, [router]);

  /* Vérification debounced du pseudo */
  const checkPseudo = useCallback((value: string, currentPseudo: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value) { setPseudoStatus('idle'); setPseudoMsg(''); return; }

    // Pas changé → pas de vérification
    if (value === currentPseudo) { setPseudoStatus('idle'); setPseudoMsg(''); return; }

    // Validation client immédiate
    const clientError = validatePseudoClient(value);
    if (clientError) { setPseudoStatus('invalid'); setPseudoMsg(clientError); return; }

    setPseudoStatus('checking');
    setPseudoMsg('Vérification…');

    debounceRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('access_token');
        const { data } = await axios.get(`${backendUrl}/users/check-pseudo`, {
          params: { pseudo: value },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.available) {
          setPseudoStatus('available');
          setPseudoMsg('Disponible !');
        } else {
          setPseudoStatus('taken');
          setPseudoMsg(data.reason || 'Ce pseudo est déjà pris.');
        }
      } catch {
        setPseudoStatus('idle');
        setPseudoMsg('');
      }
    }, 500);
  }, []);

  const handlePseudoChange = (value: string, currentPseudo: string) => {
    setEditValues((p) => ({ ...p, pseudo: value }));
    checkPseudo(value, currentPseudo);
  };

  /* Upload photo */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
    setImageLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('profileImage', file);
      await axios.patch(`${backendUrl}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      const updated = await fetchCurrentUser();
      setUser(updated);
      setPreviewSrc(null);
      addNotification('success', 'Photo de profil mise à jour.');
    } catch {
      setPreviewSrc(null);
      addNotification('critical', 'Erreur lors du changement de photo.');
    } finally {
      setImageLoading(false);
      e.target.value = '';
    }
  };

  /* Mise à jour du profil */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudoStatus === 'taken' || pseudoStatus === 'invalid') return;
    if (pseudoStatus === 'checking') { addNotification('critical', 'Attends la fin de la vérification du pseudo.'); return; }

    setEditLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('name', editValues.name);
      formData.append('lastName', editValues.lastName);
      if (editValues.pseudo && editValues.pseudo !== user?.pseudo) {
        formData.append('pseudo', editValues.pseudo);
      }
      await axios.patch(`${backendUrl}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      const updated = await fetchCurrentUser();
      setUser(updated);
      setPseudoStatus('idle');
      addNotification('success', 'Profil mis à jour avec succès.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erreur lors de la mise à jour du profil.';
      addNotification('critical', msg);
    } finally {
      setEditLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin   = user.role === UserRole.ADMIN;
  const avatarSrc = previewSrc
    ?? (typeof user.profileImage === 'string' ? user.profileImage : null)
    ?? '/images/backgrounds/placeholder.jpg';

  const roleStyles: Record<string, string> = {
    ADMIN:  'text-green-400 bg-green-400/10 border-green-400/30',
    EDITOR: 'text-blue-400  bg-blue-400/10  border-blue-400/30',
    USER:   'text-gray-400  bg-gray-400/10  border-gray-400/30',
  };

  const pseudoStatusUI: Record<PseudoStatus, { color: string; icon: React.ReactNode }> = {
    idle:      { color: 'border-gray-700',        icon: null },
    checking:  { color: 'border-yellow-500/50',   icon: <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" /> },
    available: { color: 'border-green-500/60',    icon: <FiCheck className="w-3.5 h-3.5 text-green-400" /> },
    taken:     { color: 'border-red-500/60',      icon: <FiX className="w-3.5 h-3.5 text-red-400" /> },
    invalid:   { color: 'border-red-500/60',      icon: <FiX className="w-3.5 h-3.5 text-red-400" /> },
  };
  const pseudoUI = pseudoStatusUI[pseudoStatus];

  const canSubmit = pseudoStatus !== 'taken' && pseudoStatus !== 'invalid' && pseudoStatus !== 'checking';

  return (
    <div className="min-h-screen bg-black text-white font-kanit">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-0">

        {/* Carte hero */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-green-900/40 via-gray-900 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(74,222,128,0.12),transparent_60%)]" />
            <div className="absolute top-3 right-4 w-24 h-24 rounded-full bg-green-400/5 blur-2xl" />
          </div>

          <div className="px-5 pb-5 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* Avatar cliquable */}
              <div className="relative group w-24 h-24 shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <img src={avatarSrc} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-700 shadow-2xl" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  title="Changer la photo"
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {imageLoading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <FiCamera className="w-6 h-6 text-white" />}
                </button>
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-400 border-2 border-gray-900 flex items-center justify-center pointer-events-none">
                  <FiCamera className="w-2.5 h-2.5 text-gray-900" />
                </span>
              </div>

              {/* Identité */}
              <div className="sm:pb-1 min-w-0">
                <h1 className="text-2xl font-iceberg uppercase tracking-widest text-white truncate">{user.pseudo}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-xs font-iceberg uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${roleStyles[user.role ?? 'USER']}`}>
                    {user.role}
                  </span>
                  {!isAdmin && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${user.isSubscribed ? 'text-teal-400 bg-teal-400/10 border-teal-400/30' : 'text-gray-500 bg-gray-800 border-gray-700'}`}>
                      {user.isSubscribed ? 'Abonné' : 'Non abonné'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
              <FiMail className="w-4 h-4 text-green-400 shrink-0" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Onglets (non-admin) */}
        {!isAdmin && (
          <div className="flex mt-6 border-b border-gray-800">
            {(['info', 'edit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-iceberg uppercase tracking-widest transition-colors ${
                  activeTab === tab
                    ? 'text-green-400 border-b-2 border-green-400 -mb-px'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab === 'info' ? 'Informations' : 'Modifier'}
              </button>
            ))}
          </div>
        )}

        {/* Onglet Informations */}
        {!isAdmin && activeTab === 'info' && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <p className="text-xs font-iceberg uppercase tracking-widest text-gray-500 mb-3">Informations personnelles</p>
              <div className="space-y-3.5">
                <InfoRow icon={<FiAtSign />} label="Pseudo"         value={user.pseudo || '—'} />
                <InfoRow icon={<FiUser />}   label="Prénom"         value={user.name || '—'} />
                <InfoRow icon={<FiUser />}   label="Nom de famille" value={user.lastName || '—'} />
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <p className="text-xs font-iceberg uppercase tracking-widest text-gray-500 mb-3">Détails du compte</p>
              <div className="space-y-3.5">
                <InfoRow icon={<FiShield />}   label="Statut"        value={user.status || '—'} />
                <InfoRow icon={<FiCalendar />} label="Membre depuis" value={new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <InfoRow icon={<FiCalendar />} label="Mis à jour le" value={new Date(user.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
              </div>
            </div>
          </div>
        )}

        {/* Onglet Modifier */}
        {!isAdmin && activeTab === 'edit' && (
          <form onSubmit={handleProfileUpdate} className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">

            {/* Pseudo — champ spécial avec feedback */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiAtSign className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={editValues.pseudo}
                  onChange={(e) => handlePseudoChange(e.target.value, user.pseudo)}
                  placeholder={user.pseudo}
                  maxLength={20}
                  className={`w-full bg-gray-800 border rounded-lg pl-9 pr-10 py-2 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${pseudoUI.color}`}
                />
                {pseudoUI.icon && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {pseudoUI.icon}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs ${pseudoStatus === 'available' ? 'text-green-400' : pseudoStatus === 'taken' || pseudoStatus === 'invalid' ? 'text-red-400' : 'text-gray-600'}`}>
                  {pseudoMsg || 'Lettres, chiffres, _ et - uniquement. 3–20 caractères.'}
                </p>
                <p className="text-xs text-gray-600 shrink-0 ml-2">{editValues.pseudo.length}/20</p>
              </div>
            </div>

            {/* Autres champs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Prénom"         value={editValues.name}     onChange={(v) => setEditValues(p => ({ ...p, name: v }))}     placeholder="Votre prénom" />
              <FormField label="Nom de famille" value={editValues.lastName} onChange={(v) => setEditValues(p => ({ ...p, lastName: v }))} placeholder="Votre nom de famille" />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={editLoading || !canSubmit}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-black text-sm font-iceberg uppercase tracking-widest hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editLoading
                  ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  : <FiEdit3 className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </form>
        )}

        {/* Admin — carte compte seulement */}
        {isAdmin && (
          <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-xs font-iceberg uppercase tracking-widest text-gray-500 mb-3">Détails du compte</p>
            <div className="space-y-3.5">
              <InfoRow icon={<FiShield />}   label="Statut"        value={user.status || '—'} />
              <InfoRow icon={<FiCalendar />} label="Membre depuis" value={new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
              <InfoRow icon={<FiCalendar />} label="Mis à jour le" value={new Date(user.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-green-400 mt-0.5 shrink-0 w-4">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-iceberg uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
      />
    </div>
  );
}
