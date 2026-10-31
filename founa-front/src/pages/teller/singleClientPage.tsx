import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ShieldCheck,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Ticket,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import {
  VerfiyUserByTeller,
} from "../../services/teller.service";
import {
  ReadSingleClient,
} from "../../services/auth.service";

interface Client {
  uid: string;
  fullname: string;
  email: string | null;
  phone: string;
  adresse_livraison: string | null;
  code_promo: string | null;
  status_code_promo: string | null;
  status: string;
  created_date: string | null;
  updated_date: string | null;
}

interface ToastMessage {
  message: string;
  type: "success" | "error";
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || "Impossible de joindre le serveur.";
  }

  return error instanceof Error
    ? error.message
    : "Une erreur est survenue.";
};

const formatDate = (value: string | null): string => {
  if (!value) return "Non renseignée";

  // Les dates Flask sans fuseau sont ici considérées comme UTC.
  const normalized = value.trim().replace(" ", "T");
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized) &&
      !/(Z|[+-]\d{2}:?\d{2})$/i.test(normalized)
      ? `${normalized}Z`
      : normalized
  );

  if (Number.isNaN(date.getTime())) return "Date indisponible";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Abidjan",
  }).format(date);
};

const Detail: React.FC<{
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}> = ({ icon, label, children }) => (
  <div className="sc-detail">
    <span className="sc-detail-icon">{icon}</span>
    <div>
      <span className="sc-label">{label}</span>
      <div className="sc-value">{children}</div>
    </div>
  </div>
);

const ClientDetails: React.FC<{ uid: string }> = ({ uid }) => {
  const nav = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [attempt, setAttempt] = useState(0);

  const mounted = useRef(false);
  const verificationLock = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    const loadClient = async () => {
      setLoading(true);
      setLoadError("");
      setClient(null);

      if (!uid) {
        setLoadError("Identifiant du client manquant.");
        setLoading(false);
        return;
      }

      try {
        const response = await ReadSingleClient({ uid });
        if (cancelled) return;

        const body = response.data;

        if (body.status !== "success") {
          throw new Error(body.message || "Client introuvable.");
        }

        const data = body.client ?? body.user_infos;

        if (!data || data.uid !== uid) {
          throw new Error("Les informations reçues ne correspondent pas au client.");
        }

        // Sélection explicite des champs utiles : aucun mot de passe conservé.
        setClient({
          uid: data.uid,
          fullname: data.fullname || "Client sans nom",
          email: data.email || null,
          phone: String(data.phone ?? "").trim(),
          adresse_livraison: data.adresse_livraison || null,
          code_promo: data.code_promo || null,
          status_code_promo: data.status_code_promo || null,
          status: data.status || "non-verifier",
          created_date: data.created_date || null,
          updated_date: data.updated_date || null,
        });
      } catch (error: unknown) {
        if (!cancelled) setLoadError(getErrorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadClient();

    return () => {
      cancelled = true;
    };
  }, [uid, attempt]);

  const handleVerify = async () => {
    if (
      !client ||
      client.status === "verifier" ||
      verificationLock.current
    ) {
      return;
    }

    const phone = client.phone.trim();

    if (!phone) {
      setToast({
        message: "Ce client ne possède pas de numéro de téléphone.",
        type: "error",
      });
      return;
    }

    verificationLock.current = true;
    setVerifying(true);

    try {
      // Le téléphone provient automatiquement de la fiche chargée.
      const response = await VerfiyUserByTeller({ phone });

      if (!mounted.current) return;

      if (response.data.status !== "success") {
        throw new Error(
          response.data.message || "La vérification n’a pas abouti."
        );
      }

      setClient((current) =>
        current ? { ...current, status: "verifier" } : current
      );

      setToast({
        message:
          response.data.message || "Client vérifié avec succès.",
        type: "success",
      });
    } catch (error: unknown) {
      if (mounted.current) {
        setToast({ message: getErrorMessage(error), type: "error" });
      }
    } finally {
      verificationLock.current = false;
      if (mounted.current) setVerifying(false);
    }
  };

  const verified = client?.status === "verifier";
  const initials =
    client?.fullname
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "CL";

  return (
    <div className="sc-page">
      <header className="sc-header">
        <button
          type="button"
          className="sc-back"
          onClick={() => nav("/teller/home")}
        >
          <ChevronLeft size={20} />
          Retour
        </button>
        <img src="/logo-founa2.png" alt="FOUNA" />
      </header>

      <main className="sc-container" aria-busy={loading}>
        {loading ? (
          <div className="sc-state" role="status">
            <LoaderCircle className="sc-spin" size={36} />
            <p>Chargement des informations du client…</p>
          </div>
        ) : loadError || !client ? (
          <div className="sc-state" role="alert">
            <AlertCircle size={38} />
            <h1>Fiche indisponible</h1>
            <p>{loadError || "Client introuvable."}</p>
            <button
              className="sc-primary"
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="sc-heading">
              <span className="sc-kicker">ESPACE TELLER</span>
              <h1>Fiche client</h1>
              <p>Informations personnelles et vérification du compte.</p>
            </div>

            <div className="sc-layout">
              <aside className="sc-card sc-profile">
                <div className="sc-avatar" aria-hidden="true">
                  {initials}
                </div>
                <h2>{client.fullname}</h2>
                <span className={`sc-badge ${verified ? "ok" : "pending"}`}>
                  {verified ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {verified ? "Compte vérifié" : "Compte non vérifié"}
                </span>

                <div className="sc-identifier">
                  <span className="sc-label">Identifiant client</span>
                  <span>{client.uid}</span>
                </div>

                <div className="sc-note">
                  <ShieldCheck size={21} />
                  <p>
                    {verified
                      ? "Ce compte a déjà été vérifié."
                      : "Après contrôle des informations du client, validez son compte ci-dessous."}
                  </p>
                </div>

                <button
                  type="button"
                  className="sc-primary sc-verify"
                  onClick={handleVerify}
                  disabled={verified || verifying || !client.phone}
                >
                  {verifying ? (
                    <LoaderCircle size={19} className="sc-spin" />
                  ) : (
                    <ShieldCheck size={19} />
                  )}
                  {verifying
                    ? "Vérification en cours…"
                    : verified
                    ? "Utilisateur vérifié"
                    : "Vérifier User"}
                </button>
                {!client.phone && (
                  <p className="sc-missing">Numéro de téléphone manquant.</p>
                )}
              </aside>

              <div className="sc-sections">
                <section className="sc-card">
                  <h2><UserRound size={21} /> Informations du client</h2>
                  <div className="sc-grid">
                    <Detail icon={<UserRound size={19} />} label="Nom complet">
                      {client.fullname}
                    </Detail>
                    <Detail icon={<Phone size={19} />} label="Téléphone">
                      {client.phone || "Non renseigné"}
                    </Detail>
                    <Detail icon={<Mail size={19} />} label="Adresse e-mail">
                      {client.email || "Non renseignée"}
                    </Detail>
                    <Detail icon={<MapPin size={19} />} label="Adresse de livraison">
                      {client.adresse_livraison || "Non renseignée"}
                    </Detail>
                  </div>
                </section>

                <section className="sc-card">
                  <h2><Ticket size={21} /> Code promotionnel</h2>
                  <div className="sc-promo">
                    <strong>{client.code_promo || "Aucun code promotionnel"}</strong>
                    {client.code_promo && (
                      <span
                        className={`sc-badge ${
                          client.status_code_promo === "utiliser"
                            ? "ok"
                            : "pending"
                        }`}
                      >
                        {client.status_code_promo === "utiliser"
                          ? "Utilisé"
                          : client.status_code_promo === "non-utiliser"
                          ? "Non utilisé"
                          : "Statut non renseigné"}
                      </span>
                    )}
                  </div>
                </section>

                <section className="sc-card">
                  <h2><CalendarDays size={21} /> Dates du compte</h2>
                  <div className="sc-grid">
                    <Detail icon={<CalendarDays size={19} />} label="Création">
                      {formatDate(client.created_date)}
                    </Detail>
                    <Detail icon={<CalendarDays size={19} />} label="Dernière mise à jour enregistrée">
                      {formatDate(client.updated_date)}
                    </Detail>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </main>

      {toast && (
        <div
          className={`sc-toast ${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          {toast.message}
        </div>
      )}

      <style>{`
        .sc-page, .sc-page * { box-sizing: border-box; }
        .sc-page {
          min-height: 100vh;
          background: #f5f7f8;
          color: #1f2937;
          font-family: Arial, Helvetica, sans-serif;
          padding-bottom: 80px;
        }
        .sc-page button { font: inherit; cursor: pointer; }
        .sc-page button:disabled { cursor: not-allowed; opacity: .65; }
        .sc-page button:focus-visible {
          outline: 3px solid #007c80;
          outline-offset: 4px;
        }
        .sc-header {
          display: flex; align-items: center; justify-content: space-between;
          background: white; padding: 18px max(20px, calc((100% - 1140px) / 2));
          border-bottom: 1px solid #e8edef;
        }
        .sc-header img { width: 112px; height: 40px; object-fit: contain; }
        .sc-back {
          display: flex; align-items: center; gap: 6px;
          border: 0; background: transparent; color: #374151; padding: 8px 0;
        }
        .sc-container { max-width: 1180px; margin: auto; padding: 32px 20px; }
        .sc-kicker { color: #007f82; font-size: 12px; font-weight: 700; letter-spacing: 2px; }
        .sc-heading h1 { margin: 10px 0; font-size: 30px; }
        .sc-heading p { color: #64748b; line-height: 1.6; margin: 0 0 28px; }
        .sc-layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 24px; align-items: start; }
        .sc-card {
          padding: 26px; border: 1px solid #e8edef; background: white;
          border-radius: 20px; box-shadow: 0 8px 30px #16353d06;
          min-width: 0;
        }
        .sc-card h2 { display: flex; align-items: center; gap: 10px; margin: 0 0 24px; font-size: 18px; }
        .sc-card h2 svg { color: #009b9e; flex-shrink: 0; }
        .sc-profile { text-align: center; }
        .sc-avatar {
          width: 88px; height: 88px; margin: 0 auto 18px;
          display: grid; place-items: center; border-radius: 26px;
          background: #e6f7f7; color: #00898c; font-size: 30px; font-weight: 700;
        }
        .sc-profile h2 { display: block; margin-bottom: 15px; font-size: 23px; overflow-wrap: anywhere; }
        .sc-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 11px; border-radius: 30px; font-size: 12px; font-weight: 700;
        }
        .sc-badge.ok { background: #e9f8ef; color: #187246; }
        .sc-badge.pending { background: #fff4df; color: #926017; }
        .sc-identifier { margin: 24px 0; font-size: 12px; overflow-wrap: anywhere; line-height: 1.6; }
        .sc-label { display: block; color: #687587; font-size: 12px; margin-bottom: 7px; }
        .sc-note {
          display: flex; align-items: flex-start; gap: 10px;
          background: #f2f8f8; border-radius: 12px; padding: 14px;
          text-align: left; margin-bottom: 20px; color: #466469;
        }
        .sc-note svg { flex-shrink: 0; color: #009b9e; }
        .sc-note p { margin: 0; font-size: 13px; line-height: 1.6; }
        .sc-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 9px;
          border: 0; background: #00a4a6; color: white; border-radius: 12px;
          min-height: 48px; padding: 13px 20px; font-weight: 700 !important;
        }
        .sc-primary:hover:not(:disabled) { background: #008c8e; }
        .sc-verify { width: 100%; }
        .sc-missing { color: #b64242; font-size: 12px; }
        .sc-sections { display: grid; gap: 20px; }
        .sc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px; }
        .sc-detail { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
        .sc-detail > div { min-width: 0; }
        .sc-detail-icon {
          display: grid; place-items: center; background: #f3f6f7;
          width: 38px; height: 38px; border-radius: 10px; color: #008c8e; flex-shrink: 0;
        }
        .sc-value { font-size: 14px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
        .sc-promo {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap; padding: 18px;
          background: #f7fafb; border: 1px dashed #cbdcde; border-radius: 12px;
        }
        .sc-promo strong { overflow-wrap: anywhere; }
        .sc-state { min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #64748b; }
        .sc-state > svg { color: #00a4a6; }
        .sc-state h1 { color: #1f2937; font-size: 24px; }
        .sc-toast {
          position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
          width: min(520px, calc(100% - 32px)); padding: 16px 20px;
          border-radius: 12px; color: white; text-align: center;
          box-shadow: 0 10px 35px #0002; z-index: 9999; line-height: 1.5;
        }
        .sc-toast.success { background: #00895f; }
        .sc-toast.error { background: #c44747; }
        .sc-spin { animation: sc-rotate 1s linear infinite; }
        @keyframes sc-rotate { to { transform: rotate(360deg); } }
        @media (max-width: 850px) {
          .sc-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .sc-container { padding: 24px 14px; }
          .sc-grid { grid-template-columns: 1fr; gap: 22px; }
          .sc-card { padding: 22px 18px; border-radius: 16px; }
          .sc-heading h1 { font-size: 26px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-spin { animation: none; }
        }
      `}</style>
    </div>
  );
};

const SingleClientPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();

  // Réinitialise complètement la fiche quand le client change.
  return <ClientDetails key={uid || "missing"} uid={uid || ""} />;
};

export default SingleClientPage;