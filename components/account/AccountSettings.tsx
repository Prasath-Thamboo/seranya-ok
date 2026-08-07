"use client";

import React, { useEffect, useState, useRef, useCallback, useId } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchCurrentUser, generateResetToken, deleteUserAccount, getAccessToken } from '@/lib/queries/AuthQueries';
import { fetchSubscriptionInfo, cancelSubscription as cancelSubscriptionRequest, SubscriptionInfo } from '@/lib/queries/PaymentQueries';
import { RegisterUserModel, UserRole } from '@/lib/models/AuthModels';
import { useNotification } from '@/components/notifications/NotificationProvider';
import {
  FiCamera, FiMail, FiShield, FiCalendar,
  FiUser, FiEdit3, FiCheck, FiX, FiAtSign, FiLock, FiSend, FiAlertTriangle, FiTrash2,
  FiCreditCard, FiXCircle,
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
export default function AccountSettings({ withNavbarOffset = false }: { withNavbarOffset?: boolean }) {
  const [user, setUser]                 = useState<RegisterUserModel | null>(null);
  const [previewSrc, setPreviewSrc]     = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [editLoading, setEditLoading]   = useState(false);
  const [activeTab, setActiveTab]       = useState<'info' | 'edit'>('info');
  const [editValues, setEditValues]     = useState({ name: '', lastName: '', pseudo: '' });
  const [pseudoStatus, setPseudoStatus] = useState<PseudoStatus>('idle');
  const [pseudoMsg, setPseudoMsg]       = useState('');
  const [emailEditing, setEmailEditing] = useState(false);
  const [newEmail, setNewEmail]         = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent]       = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [subscription, setSubscription]           = useState<SubscriptionInfo | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [cancelConfirming, setCancelConfirming]    = useState(false);
  const [cancelLoading, setCancelLoading]          = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const debounceRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router                          = useRouter();
  const { addNotification }             = useNotification();

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        setEditValues({ name: u.name || '', lastName: u.lastName || '', pseudo: u.pseudo || '' });
        if (u.role === UserRole.EDITOR) {
          setSubscriptionLoading(true);
          fetchSubscriptionInfo()
            .then(setSubscription)
            .catch(() => setSubscription(null))
            .finally(() => setSubscriptionLoading(false));
        }
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

  /* Demande de changement d'email : un email de confirmation part sur la nouvelle adresse */
  const handleRequestEmailChange = async () => {
    if (!newEmail || newEmail === user?.email) return;
    setEmailLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${backendUrl}/users/me/change-email`,
        { newEmail },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEmailSent(true);
      setEmailEditing(false);
      addNotification('success', 'Un email de confirmation a été envoyé à la nouvelle adresse.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de la demande de changement d'email.";
      addNotification('critical', msg);
    } finally {
      setEmailLoading(false);
    }
  };

  /* Demande de changement de mot de passe : réutilise le flux "mot de passe oublié" */
  const handleRequestPasswordReset = async () => {
    if (!user?.email) return;
    setPasswordLoading(true);
    try {
      await generateResetToken(user.email);
      setPasswordSent(true);
      addNotification('success', 'Un email vous a été envoyé pour réinitialiser votre mot de passe.');
    } catch {
      addNotification('critical', "Erreur lors de l'envoi de l'email de réinitialisation.");
    } finally {
      setPasswordLoading(false);
    }
  };

  /* Suppression définitive du compte et des données liées (RGPD) */
  const handleDeleteAccount = async () => {
    const token = getAccessToken();
    if (!token) return;
    setDeleteLoading(true);
    try {
      await deleteUserAccount(token);
      // Rechargement complet (plutôt qu'un router.push) pour que la Navbar,
      // qui ne relit l'état d'authentification qu'au montage, reflète bien
      // la déconnexion.
      window.location.href = '/';
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erreur lors de la suppression du compte.';
      addNotification('critical', msg);
      setDeleteLoading(false);
    }
  };

  /* Résiliation de l'abonnement premium (immédiate) */
  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscriptionRequest();
      const updated = await fetchCurrentUser();
      setUser(updated);
      setSubscription(null);
      setCancelConfirming(false);
      addNotification('success', 'Votre abonnement a été résilié.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erreur lors de la résiliation de l'abonnement.";
      addNotification('critical', msg);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-[60vh] ${withNavbarOffset ? 'pt-24' : ''}`}>
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
      <div className={`max-w-2xl mx-auto px-4 sm:px-0 ${withNavbarOffset ? 'pt-24 pb-6' : 'py-6'}`}>

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

        {/* Onglets */}
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

        {/* Onglet Informations */}
        {activeTab === 'info' && (
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
        {activeTab === 'edit' && (
          <form onSubmit={handleProfileUpdate} className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">

            {/* Pseudo — champ spécial avec feedback */}
            <div className="sm:col-span-2">
              <label htmlFor="account-pseudo" className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiAtSign className="w-4 h-4" />
                </span>
                <input
                  id="account-pseudo"
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
              <div className="flex justify-between items-center mt-1 gap-2">
                <p className={`text-xs min-w-0 ${pseudoStatus === 'available' ? 'text-green-400' : pseudoStatus === 'taken' || pseudoStatus === 'invalid' ? 'text-red-400' : 'text-gray-600'}`}>
                  {pseudoMsg || 'Lettres, chiffres, _ et - uniquement. 3–20 caractères.'}
                </p>
                <p className="text-xs text-gray-600 shrink-0">{editValues.pseudo.length}/20</p>
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

        {/* Sécurité : email et mot de passe (changements soumis à confirmation par email) */}
        {activeTab === 'edit' && (
          <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-5">
            <p className="text-xs font-iceberg uppercase tracking-widest text-gray-500">Sécurité du compte</p>

            {/* Email */}
            <div>
              <label htmlFor="account-email" className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">
                Adresse email
              </label>
              {!emailEditing ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300 min-w-0">
                    <FiMail className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmailEditing(true); setNewEmail(''); setEmailSent(false); }}
                    className="text-xs font-iceberg uppercase tracking-widest text-green-400 hover:text-green-300 shrink-0 self-start sm:self-auto"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    id="account-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Nouvelle adresse email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRequestEmailChange}
                      disabled={emailLoading || !newEmail}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-xs font-iceberg uppercase tracking-widest hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {emailLoading
                        ? <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        : <FiSend className="w-3.5 h-3.5" />}
                      Envoyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailEditing(false)}
                      className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs font-iceberg uppercase tracking-widest hover:text-gray-200 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-1.5">
                {emailSent
                  ? 'Un email de confirmation a été envoyé à la nouvelle adresse. Le changement prendra effet une fois le lien cliqué.'
                  : "Un email de confirmation sera envoyé à la nouvelle adresse ; le changement ne prend effet qu'après validation du lien."}
              </p>
            </div>

            {/* Mot de passe */}
            <div className="pt-4 border-t border-gray-800">
              <label className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">
                Mot de passe
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <FiLock className="w-4 h-4 text-green-400 shrink-0" />
                  <span>••••••••</span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPasswordReset}
                  disabled={passwordLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-xs font-iceberg uppercase tracking-widest text-gray-300 hover:border-green-400 hover:text-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {passwordLoading
                    ? <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    : <FiSend className="w-3.5 h-3.5" />}
                  Changer le mot de passe
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1.5">
                {passwordSent
                  ? 'Un email vous a été envoyé avec un lien pour définir un nouveau mot de passe.'
                  : "Un email contenant un lien de réinitialisation vous sera envoyé à l'adresse actuelle."}
              </p>
            </div>
          </div>
        )}

        {/* Gestion de l'abonnement : réservée aux éditeurs (statut obtenu via l'abonnement premium) */}
        {activeTab === 'edit' && user.role === UserRole.EDITOR && (
          <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-4">
            <p className="text-xs font-iceberg uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <FiCreditCard className="w-3.5 h-3.5 text-green-400" />
              Gestion de l&apos;abonnement
            </p>

            {subscriptionLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                Chargement des informations d&apos;abonnement…
              </div>
            ) : subscription?.subscribed ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <InfoRow
                    icon={<FiShield />}
                    label="Statut"
                    value={subscription.status === 'active' ? 'Actif' : subscription.status || '—'}
                  />
                  {subscription.amount != null && subscription.currency && (
                    <InfoRow
                      icon={<FiCreditCard />}
                      label="Tarif"
                      value={`${(subscription.amount / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ${subscription.currency.toUpperCase()} / ${subscription.interval === 'month' ? 'mois' : subscription.interval}`}
                    />
                  )}
                  {subscription.currentPeriodEnd && (
                    <InfoRow
                      icon={<FiCalendar />}
                      label="Prochain renouvellement"
                      value={new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    />
                  )}
                </div>

                <div className="pt-2 border-t border-gray-800">
                  {!cancelConfirming ? (
                    <button
                      type="button"
                      onClick={() => setCancelConfirming(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs font-iceberg uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-colors"
                    >
                      <FiXCircle className="w-3.5 h-3.5" />
                      Résilier l&apos;abonnement
                    </button>
                  ) : (
                    <div className="border border-red-900/50 rounded-lg p-4 space-y-3 bg-red-950/10">
                      <p className="text-sm text-red-300">
                        Ton abonnement sera résilié immédiatement et tu perdras le statut éditeur
                        ainsi que l&apos;accès au contenu premium. Cette action est irréversible.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCancelSubscription}
                          disabled={cancelLoading}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-iceberg uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {cancelLoading
                            ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <FiXCircle className="w-3.5 h-3.5" />}
                          Confirmer la résiliation
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelConfirming(false)}
                          disabled={cancelLoading}
                          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs font-iceberg uppercase tracking-widest hover:text-gray-200 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-500">Aucun abonnement actif trouvé.</p>
            )}
          </div>
        )}

        {/* Zone dangereuse : suppression définitive du compte et des données liées */}
        {activeTab === 'edit' && (
          <div className="mt-4 bg-gray-900 rounded-xl border border-red-900/40 p-5 space-y-3">
            <p className="text-xs font-iceberg uppercase tracking-widest text-red-400 flex items-center gap-2">
              <FiAlertTriangle className="w-3.5 h-3.5" />
              Zone dangereuse
            </p>
            <p className="text-xs text-gray-500">
              Supprime définitivement votre compte, vos commentaires, votre accès aux contenus premium
              et résilie votre abonnement en cours le cas échéant. Cette action est irréversible.
            </p>

            {!deleteConfirming ? (
              <button
                type="button"
                onClick={() => setDeleteConfirming(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-900/50 text-red-400 text-xs font-iceberg uppercase tracking-widest hover:bg-red-900/20 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Supprimer mon compte
              </button>
            ) : (
              <div className="border border-red-900/50 rounded-lg p-4 space-y-3 bg-red-950/10">
                <p className="text-sm text-red-300">
                  Es-tu sûr(e) ? Ton compte et toutes les données associées seront supprimés
                  définitivement et ne pourront pas être récupérés.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-iceberg uppercase tracking-widest hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deleteLoading
                      ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <FiTrash2 className="w-3.5 h-3.5" />}
                    Confirmer la suppression définitive
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirming(false)}
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs font-iceberg uppercase tracking-widest hover:text-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
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
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-iceberg uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
      />
    </div>
  );
}
