"use client";

import React, { useEffect, useState, useRef, useCallback, useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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

/** Renvoie une clé i18n sous `account.validation.*`, ou null si le pseudo est valide. */
function validatePseudoClient(pseudo: string): string | null {
  if (pseudo.length < 3)  return 'pseudoMin';
  if (pseudo.length > 20) return 'pseudoMax';
  if (!/^[a-zA-Z0-9]/.test(pseudo)) return 'pseudoStart';
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(pseudo) && pseudo.length > 1)
    return 'pseudoChars';
  if (/__|--/.test(pseudo)) return 'pseudoConsecutive';
  const n = normalizePseudo(pseudo);
  if (BLOCKED_WORDS.some((w) => n.includes(normalizePseudo(w))))
    return 'pseudoBlocked';
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
  const t                               = useTranslations('account');
  const locale                          = useLocale();
  const dateLocale                      = locale === 'en' ? 'en-GB' : 'fr-FR';
  const fmtDate = (d: string | number | Date) =>
    new Date(d).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });

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
    if (clientError) { setPseudoStatus('invalid'); setPseudoMsg(t(`validation.${clientError}`)); return; }

    setPseudoStatus('checking');
    setPseudoMsg(t('pseudoChecking'));

    debounceRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('access_token');
        const { data } = await axios.get(`${backendUrl}/users/check-pseudo`, {
          params: { pseudo: value },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.available) {
          setPseudoStatus('available');
          setPseudoMsg(t('pseudoAvailable'));
        } else {
          setPseudoStatus('taken');
          setPseudoMsg(data.reason || t('pseudoTaken'));
        }
      } catch {
        setPseudoStatus('idle');
        setPseudoMsg('');
      }
    }, 500);
  }, [t]);

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
      addNotification('success', t('notifications.photoUpdated'));
    } catch {
      setPreviewSrc(null);
      addNotification('critical', t('notifications.photoError'));
    } finally {
      setImageLoading(false);
      e.target.value = '';
    }
  };

  /* Mise à jour du profil */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudoStatus === 'taken' || pseudoStatus === 'invalid') return;
    if (pseudoStatus === 'checking') { addNotification('critical', t('waitPseudoCheck')); return; }

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
      addNotification('success', t('notifications.profileUpdated'));
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('notifications.profileError');
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
      addNotification('success', t('notifications.emailChangeSent'));
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('notifications.emailChangeError');
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
      addNotification('success', t('notifications.passwordResetSent'));
    } catch {
      addNotification('critical', t('notifications.passwordResetError'));
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
      const msg = err?.response?.data?.message || t('notifications.deleteError');
      addNotification('critical', msg);
      setDeleteLoading(false);
    }
  };

  /* Résiliation de l'abonnement premium : l'accès est conservé jusqu'à la fin de la période payée */
  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscriptionRequest();
      const updatedSubscription = await fetchSubscriptionInfo();
      setSubscription(updatedSubscription);
      setCancelConfirming(false);
      addNotification(
        'success',
        updatedSubscription.currentPeriodEnd
          ? t('notifications.cancelSuccessWithDate', {
              date: fmtDate(updatedSubscription.currentPeriodEnd * 1000),
            })
          : t('notifications.cancelSuccessNoDate'),
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('notifications.cancelError');
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
    ADMIN:  'text-info bg-info-soft border-info/30',
    EDITOR: 'text-accent bg-accent-soft border-accent/30',
    USER:   'text-ink-soft bg-sand-100 border-line',
  };

  const pseudoStatusUI: Record<PseudoStatus, { color: string; icon: React.ReactNode }> = {
    idle:      { color: 'border-line',        icon: null },
    checking:  { color: 'border-warning/50',   icon: <div className="w-3.5 h-3.5 border-2 border-warning border-t-transparent rounded-full animate-spin" /> },
    available: { color: 'border-accent/60',    icon: <FiCheck className="w-3.5 h-3.5 text-accent" /> },
    taken:     { color: 'border-danger/60',      icon: <FiX className="w-3.5 h-3.5 text-danger" /> },
    invalid:   { color: 'border-danger/60',      icon: <FiX className="w-3.5 h-3.5 text-danger" /> },
  };
  const pseudoUI = pseudoStatusUI[pseudoStatus];

  const canSubmit = pseudoStatus !== 'taken' && pseudoStatus !== 'invalid' && pseudoStatus !== 'checking';

  return (
    <div className="min-h-screen bg-page text-ink font-sans">
      <div className={`max-w-2xl mx-auto px-4 sm:px-0 ${withNavbarOffset ? 'pt-24 pb-6' : 'py-6'}`}>

        {/* Carte hero */}
        <div className="bg-raised rounded-2xl border border-line overflow-hidden shadow-sm">
          <div className="h-20 bg-gradient-to-r from-accent-soft via-sunken to-transparent" />


          <div className="px-5 pb-5 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* Avatar cliquable */}
              <div className="relative group w-24 h-24 shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <img src={avatarSrc} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-line shadow-2xl" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  title={t('changePhotoTitle')}
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {imageLoading
                    ? <div className="w-5 h-5 border-2 border-ink-invert border-t-transparent rounded-full animate-spin" />
                    : <FiCamera className="w-6 h-6 text-white" />}
                </button>
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent border-2 border-raised flex items-center justify-center pointer-events-none">
                  <FiCamera className="w-2.5 h-2.5 text-ink-invert" />
                </span>
              </div>

              {/* Identité */}
              <div className="sm:pb-1 min-w-0">
                <h1 className="text-2xl font-serif font-medium text-ink truncate">{user.pseudo}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full border ${roleStyles[user.role ?? 'USER']}`}>
                    {user.role}
                  </span>
                  {!isAdmin && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${user.isSubscribed ? 'text-accent bg-accent-soft border-accent/30' : 'text-ink-muted bg-sunken border-line'}`}>
                      {user.isSubscribed ? t('subscribed') : t('notSubscribed')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-ink-soft text-sm">
              <FiMail className="w-4 h-4 text-green-400 shrink-0" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex mt-6 border-b border-line">
          {(['info', 'edit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-sans transition-colors ${
                activeTab === tab
                  ? 'text-green-400 border-b-2 border-green-400 -mb-px'
                  : 'text-ink-muted hover:text-ink-soft'
              }`}
            >
              {tab === 'info' ? t('tabInfo') : t('tabEdit')}
            </button>
          ))}
        </div>

        {/* Onglet Informations */}
        {activeTab === 'info' && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-raised rounded-xl border border-line p-4">
              <p className="text-xs font-sans text-ink-muted mb-3">{t('personalInfo')}</p>
              <div className="space-y-3.5">
                <InfoRow icon={<FiAtSign />} label={t('labelPseudo')}    value={user.pseudo || '—'} />
                <InfoRow icon={<FiUser />}   label={t('labelFirstName')} value={user.name || '—'} />
                <InfoRow icon={<FiUser />}   label={t('labelLastName')}  value={user.lastName || '—'} />
              </div>
            </div>
            <div className="bg-raised rounded-xl border border-line p-4">
              <p className="text-xs font-sans text-ink-muted mb-3">{t('accountDetails')}</p>
              <div className="space-y-3.5">
                <InfoRow icon={<FiShield />}   label={t('labelStatus')}  value={user.status || '—'} />
                <InfoRow icon={<FiCalendar />} label={t('memberSince')}  value={fmtDate(user.createdAt)} />
                <InfoRow icon={<FiCalendar />} label={t('updatedOn')}    value={fmtDate(user.updatedAt)} />
              </div>
            </div>
          </div>
        )}

        {/* Onglet Modifier */}
        {activeTab === 'edit' && (
          <form onSubmit={handleProfileUpdate} className="mt-4 bg-raised rounded-xl border border-line p-5 space-y-4">

            {/* Pseudo — champ spécial avec feedback */}
            <div className="sm:col-span-2">
              <label htmlFor="account-pseudo" className="block text-[10px] font-sans text-ink-muted mb-1.5">
                {t('usernameLabel')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                  <FiAtSign className="w-4 h-4" />
                </span>
                <input
                  id="account-pseudo"
                  type="text"
                  value={editValues.pseudo}
                  onChange={(e) => handlePseudoChange(e.target.value, user.pseudo)}
                  placeholder={user.pseudo}
                  maxLength={20}
                  className={`w-full bg-sunken border rounded-lg pl-9 pr-10 py-2 text-sm text-ink placeholder-ink-muted focus:outline-none transition-colors ${pseudoUI.color}`}
                />
                {pseudoUI.icon && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {pseudoUI.icon}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-1 gap-2">
                <p className={`text-xs min-w-0 ${pseudoStatus === 'available' ? 'text-accent' : pseudoStatus === 'taken' || pseudoStatus === 'invalid' ? 'text-danger' : 'text-ink-muted'}`}>
                  {pseudoMsg || t('pseudoHint')}
                </p>
                <p className="text-xs text-ink-muted shrink-0">{editValues.pseudo.length}/20</p>
              </div>
            </div>

            {/* Autres champs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={t('labelFirstName')} value={editValues.name}     onChange={(v) => setEditValues(p => ({ ...p, name: v }))}     placeholder={t('firstNamePlaceholder')} />
              <FormField label={t('labelLastName')}  value={editValues.lastName} onChange={(v) => setEditValues(p => ({ ...p, lastName: v }))} placeholder={t('lastNamePlaceholder')} />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={editLoading || !canSubmit}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-ink-invert text-sm font-sans hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editLoading
                  ? <div className="w-4 h-4 border-2 border-ink-invert border-t-transparent rounded-full animate-spin" />
                  : <FiEdit3 className="w-4 h-4" />}
                {t('save')}
              </button>
            </div>
          </form>
        )}

        {/* Sécurité : email et mot de passe (changements soumis à confirmation par email) */}
        {activeTab === 'edit' && (
          <div className="mt-4 bg-raised rounded-xl border border-line p-5 space-y-5">
            <p className="text-xs font-sans text-ink-muted">{t('accountSecurity')}</p>

            {/* Email */}
            <div>
              <label htmlFor="account-email" className="block text-[10px] font-sans text-ink-muted mb-1.5">
                {t('emailLabel')}
              </label>
              {!emailEditing ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-ink-soft min-w-0">
                    <FiMail className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmailEditing(true); setNewEmail(''); setEmailSent(false); }}
                    className="text-xs font-sans text-green-400 hover:text-green-300 shrink-0 self-start sm:self-auto"
                  >
                    {t('change')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    id="account-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={t('newEmailPlaceholder')}
                    className="w-full bg-page border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-accent transition-colors"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRequestEmailChange}
                      disabled={emailLoading || !newEmail}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-ink-invert text-xs font-sans hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {emailLoading
                        ? <div className="w-3.5 h-3.5 border-2 border-ink-invert border-t-transparent rounded-full animate-spin" />
                        : <FiSend className="w-3.5 h-3.5" />}
                      {t('send')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailEditing(false)}
                      className="px-4 py-2 rounded-lg border border-line text-ink-soft text-xs font-sans hover:text-ink transition-colors"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-ink-muted mt-1.5">
                {emailSent ? t('emailHintSent') : t('emailHintDefault')}
              </p>
            </div>

            {/* Mot de passe */}
            <div className="pt-4 border-t border-line">
              <label className="block text-[10px] font-sans text-ink-muted mb-1.5">
                {t('passwordLabel')}
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-ink-soft">
                  <FiLock className="w-4 h-4 text-green-400 shrink-0" />
                  <span>••••••••</span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestPasswordReset}
                  disabled={passwordLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-line text-xs font-sans text-ink-soft hover:border-green-400 hover:text-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {passwordLoading
                    ? <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    : <FiSend className="w-3.5 h-3.5" />}
                  {t('changePassword')}
                </button>
              </div>
              <p className="text-xs text-ink-muted mt-1.5">
                {passwordSent ? t('passwordHintSent') : t('passwordHintDefault')}
              </p>
            </div>
          </div>
        )}

        {/* Gestion de l'abonnement : réservée aux éditeurs (statut obtenu via l'abonnement premium) */}
        {activeTab === 'edit' && user.role === UserRole.EDITOR && (
          <div className="mt-4 bg-raised rounded-xl border border-line p-5 space-y-4">
            <p className="text-xs font-sans text-ink-muted flex items-center gap-2">
              <FiCreditCard className="w-3.5 h-3.5 text-green-400" />
              {t('subscriptionManagement')}
            </p>

            {subscriptionLoading ? (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                {t('subscriptionLoading')}
              </div>
            ) : subscription?.subscribed ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <InfoRow
                    icon={<FiShield />}
                    label={t('labelStatus')}
                    value={subscription.status === 'active' ? t('statusActive') : subscription.status || '—'}
                  />
                  {subscription.amount != null && subscription.currency && (
                    <InfoRow
                      icon={<FiCreditCard />}
                      label={t('labelPrice')}
                      value={t('priceValue', {
                        amount: (subscription.amount / 100).toLocaleString(dateLocale, { minimumFractionDigits: 2 }),
                        currency: subscription.currency.toUpperCase(),
                        interval: subscription.interval === 'month' ? t('intervalMonth') : subscription.interval ?? '',
                      })}
                    />
                  )}
                  {subscription.currentPeriodEnd && (
                    <InfoRow
                      icon={<FiCalendar />}
                      label={subscription.cancelAtPeriodEnd ? t('accessUntil') : t('nextRenewal')}
                      value={fmtDate(subscription.currentPeriodEnd * 1000)}
                    />
                  )}
                </div>

                <div className="pt-2 border-t border-line">
                  {subscription.cancelAtPeriodEnd ? (
                    <p className="text-sm text-warning bg-warning/10 border border-warning/30 rounded-lg p-3">
                      {t('cancelledNotice', {
                        date: subscription.currentPeriodEnd
                          ? fmtDate(subscription.currentPeriodEnd * 1000)
                          : t('periodEndFallback'),
                      })}
                    </p>
                  ) : !cancelConfirming ? (
                    <button
                      type="button"
                      onClick={() => setCancelConfirming(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-line text-ink-soft text-xs font-sans hover:border-danger/50 hover:text-danger transition-colors"
                    >
                      <FiXCircle className="w-3.5 h-3.5" />
                      {t('cancelSubscription')}
                    </button>
                  ) : (
                    <div className="border border-danger/40 rounded-lg p-4 space-y-3 bg-danger/5">
                      <p className="text-sm text-danger">
                        {t('cancelConfirmText', {
                          dateSuffix: subscription.currentPeriodEnd
                            ? ` (${fmtDate(subscription.currentPeriodEnd * 1000)})`
                            : '',
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCancelSubscription}
                          disabled={cancelLoading}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-danger text-ink-invert text-xs font-sans hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {cancelLoading
                            ? <div className="w-3.5 h-3.5 border-2 border-ink-invert border-t-transparent rounded-full animate-spin" />
                            : <FiXCircle className="w-3.5 h-3.5" />}
                          {t('confirmCancel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelConfirming(false)}
                          disabled={cancelLoading}
                          className="px-4 py-2 rounded-lg border border-line text-ink-soft text-xs font-sans hover:text-ink transition-colors"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-ink-muted">{t('noActiveSubscription')}</p>
            )}
          </div>
        )}

        {/* Zone dangereuse : suppression définitive du compte et des données liées */}
        {activeTab === 'edit' && (
          <div className="mt-4 bg-raised rounded-xl border border-danger/30 p-5 space-y-3">
            <p className="text-xs font-sans text-danger flex items-center gap-2">
              <FiAlertTriangle className="w-3.5 h-3.5" />
              {t('dangerZone')}
            </p>
            <p className="text-xs text-ink-muted">
              {t('dangerDescription')}
            </p>

            {!deleteConfirming ? (
              <button
                type="button"
                onClick={() => setDeleteConfirming(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger/40 text-danger text-xs font-sans hover:bg-danger/10 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                {t('deleteAccount')}
              </button>
            ) : (
              <div className="border border-danger/40 rounded-lg p-4 space-y-3 bg-danger/5">
                <p className="text-sm text-danger">
                  {t('deleteConfirmText')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-danger text-ink-invert text-xs font-sans hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deleteLoading
                      ? <div className="w-3.5 h-3.5 border-2 border-ink-invert border-t-transparent rounded-full animate-spin" />
                      : <FiTrash2 className="w-3.5 h-3.5" />}
                    {t('confirmDelete')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirming(false)}
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-lg border border-line text-ink-soft text-xs font-sans hover:text-ink transition-colors"
                  >
                    {t('cancel')}
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
        <p className="text-[10px] font-sans text-ink-muted">{label}</p>
        <p className="text-sm text-ink mt-0.5 break-words">{value}</p>
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
      <label htmlFor={id} className="block text-[10px] font-sans text-ink-muted mb-1.5">{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-page border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
