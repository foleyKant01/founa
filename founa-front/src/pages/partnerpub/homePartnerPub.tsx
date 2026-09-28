import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  UserRound,
  BarChart3,
  Users,
  TrendingUp,
  Wallet,
  RefreshCw,
  LogOut,
  Store,
  Copy,
  Check,
  Mail,
  Phone,
  KeyRound,
  Tag,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import {
  UpdatePartnerPub,
  StatistiquesPartnerPub,
} from "../../services/partnerpub.service";

const HomePartnerPub: React.FC = () => {
  const navigate = useNavigate();

  const [partnerpub, setPartnerpub] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [statistics, setStatistics] = useState({
    nombreUtilisateurs: 0,
    nombreCommandesLivrees: 0,
    revenuTotal: 0,
    revenuParMois: [] as {
      year: number;
      month: number;
      revenu: number;
    }[],
  });

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    code_promo: "",
    password: "",
  });

  

  useEffect(() => {
    const storedPartnerPub = localStorage.getItem("partnerpub");

    if (!storedPartnerPub) {
      navigate("/auth/login");
      return;
    }

    try {
      const parsedPartnerPub = JSON.parse(storedPartnerPub);

      if (!parsedPartnerPub?.uid) {
        localStorage.removeItem("partnerpub");
        navigate("/auth/login");
        return;
      }

      setPartnerpub(parsedPartnerPub);

      setFormData({
        fullname: parsedPartnerPub.fullname || "",
        email: parsedPartnerPub.email || "",
        phone: parsedPartnerPub.phone || "",
        code_promo: parsedPartnerPub.code_promo || "",
        password: "",
      });
    } catch (error) {
      console.error(
        "Erreur lecture PartnerPub :",
        error
      );

      localStorage.removeItem("partnerpub");
      navigate("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  

  useEffect(() => {
    if (!partnerpub?.uid) return;

    loadStatistics();
  }, [partnerpub]);

  const loadStatistics = async () => {
    if (!partnerpub?.uid) return;

    try {
      setLoadingStatistics(true);

      const response = await StatistiquesPartnerPub({
        partnerpub_id: partnerpub.uid,
      });

      if (response.data.status === "success") {
        setStatistics({
          nombreUtilisateurs:
            Number(
              response.data.nombre_utilisateurs
            ) || 0,

          nombreCommandesLivrees:
            Number(
              response.data.nombre_commandes_livrees
            ) || 0,

          revenuTotal:
            Number(
              response.data.revenu_total
            ) || 0,

          revenuParMois:
            response.data.revenu_par_mois || [],
        });
      } else {
        console.error(
          "Erreur statistiques :",
          response.data.message
        );
      }
    } catch (error) {
      console.error(
        "Erreur récupération statistiques PartnerPub :",
        error
      );
    } finally {
      setLoadingStatistics(false);
    }
  };

  

  const refreshStatistics = async () => {
    await loadStatistics();

    Swal.fire({
      icon: "success",
      title: "Actualisé",
      text: "Les statistiques ont été actualisées.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!partnerpub?.uid) {
      return;
    }

    if (!formData.fullname.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nom obligatoire",
        text: "Veuillez renseigner votre nom complet.",
      });
      return;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email obligatoire",
        text: "Veuillez renseigner votre adresse email.",
      });
      return;
    }

    if (!formData.phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Téléphone obligatoire",
        text: "Veuillez renseigner votre numéro de téléphone.",
      });
      return;
    }

    if (!formData.code_promo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Code promo obligatoire",
        text: "Veuillez renseigner votre code promo.",
      });
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        partnerpub_id: partnerpub.uid,
        fullname: formData.fullname.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        code_promo: formData.code_promo.trim(),
        ...(formData.password.trim()
          ? {
              password: formData.password.trim(),
            }
          : {}),
      };

      
      const response = await UpdatePartnerPub(
        updateData as any
      );

      if (response.data.status === "success") {
        const updatedPartner =
          response.data.partner;

        const newPartnerInfos = {
          uid:
            updatedPartner?.uid ||
            partnerpub.uid,

          fullname:
            updatedPartner?.fullname ||
            formData.fullname,

          email:
            updatedPartner?.email ||
            formData.email,

          phone:
            updatedPartner?.phone ||
            formData.phone,

          code_promo:
            updatedPartner?.code_promo ||
            formData.code_promo,

          creation_date:
            updatedPartner?.creation_date ||
            partnerpub.creation_date,

          updated_date:
            updatedPartner?.updated_date ||
            new Date().toISOString(),
        };

        setPartnerpub(newPartnerInfos);

        setFormData((prev) => ({
          ...prev,
          fullname:
            newPartnerInfos.fullname,

          email:
            newPartnerInfos.email,

          phone:
            newPartnerInfos.phone,

          code_promo:
            newPartnerInfos.code_promo,

          password: "",
        }));

        localStorage.setItem(
          "partnerpub",
          JSON.stringify(newPartnerInfos)
        );

        Swal.fire({
          icon: "success",
          title: "Informations mises à jour",
          text:
            response.data.message ||
            "Vos informations ont été mises à jour avec succès.",
          confirmButtonColor: "#00A4A6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Mise à jour impossible",
          text:
            response.data.message ||
            "Une erreur est survenue.",
          confirmButtonColor: "#00A4A6",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur mise à jour PartnerPub :",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Une erreur est survenue lors de la mise à jour.";

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message,
        confirmButtonColor: "#00A4A6",
      });
    } finally {
      setSaving(false);
    }
  };

  

  const handleCopyCode = async () => {
    if (!partnerpub?.code_promo) return;

    try {
      await navigator.clipboard.writeText(
        partnerpub.code_promo
      );

      setCopied(true);

      Swal.fire({
        icon: "success",
        title: "Code copié",
        text: "Votre code promo a été copié.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Erreur copie code promo :",
        error
      );
    }
  };

  

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Déconnexion",
      text: "Voulez-vous vraiment vous déconnecter ?",
      showCancelButton: true,
      confirmButtonText: "Oui, me déconnecter",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("partnerpub");

    navigate("/auth/login");
  };

  

  const formatMoney = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      "fr-FR",
      {
        maximumFractionDigits: 0,
      }
    ).format(value);
  };

  

  const getLastMonthlyRevenue = () => {
    if (
      !statistics.revenuParMois ||
      statistics.revenuParMois.length === 0
    ) {
      return 0;
    }

    const last =
      statistics.revenuParMois[
        statistics.revenuParMois.length - 1
      ];

    return Number(last?.revenu) || 0;
  };

  

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes partnerPubSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }

            .partnerpub-loader {
              position: fixed;
              inset: 0;
              width: 100vw;
              height: 100vh;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 99999;
            }

            .partnerpub-spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #E5E7EB;
              border-top-color: #00A4A6;
              border-radius: 50%;
              animation: partnerPubSpin 0.8s linear infinite;
            }
          `}
        </style>

        <div className="partnerpub-loader">
          <div className="partnerpub-spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          @keyframes partnerPubSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .partnerpub-page {
            min-height: 100vh;
            width: 100%;
            background: #F5F7F8;
            padding: 24px 24px 100px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .partnerpub-wrapper {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
          }

          

          .partnerpub-header {
            background: linear-gradient(
              135deg,
              #00A4A6 0%,
              #00898B 100%
            );
            border-radius: 22px;
            padding: 30px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
            margin-bottom: 24px;
            box-shadow: 0 12px 35px rgba(0,164,166,0.18);
          }

          .partnerpub-header-left {
            display: flex;
            align-items: center;
            gap: 18px;
            min-width: 0;
          }

          .partnerpub-logo {
            width: 68px;
            height: 68px;
            border-radius: 18px;
            background: rgba(255,255,255,0.18);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .partnerpub-heading {
            min-width: 0;
          }

          .partnerpub-heading h1 {
            margin: 0;
            font-size: 27px;
            font-weight: 700;
          }

          .partnerpub-heading p {
            margin: 7px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }

          .partnerpub-header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
          }

          .partnerpub-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 30px;
            background: rgba(255,255,255,0.16);
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
          }

          .promo-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 15px;
            border-radius: 11px;
            background: rgba(255,255,255,0.16);
            border: 1px solid rgba(255,255,255,0.25);
            font-size: 13px;
            font-weight: 700;
          }

          .promo-header strong {
            letter-spacing: 0.5px;
          }

          

          .partnerpub-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }

          .partnerpub-stat {
            background: #ffffff;
            border-radius: 17px;
            padding: 21px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
            transition: 0.2s;
          }

          .partnerpub-stat:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 22px rgba(0,0,0,0.07);
          }

          .partnerpub-stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .stat-teal {
            background: #E8F8F8;
            color: #00A4A6;
          }

          .stat-blue {
            background: #EFF6FF;
            color: #2563EB;
          }

          .stat-orange {
            background: #FFF7ED;
            color: #EA580C;
          }

          .stat-green {
            background: #F0FDF4;
            color: #16A34A;
          }

          .partnerpub-stat-info span {
            display: block;
            color: #6B7280;
            font-size: 12px;
            margin-bottom: 5px;
          }

          .partnerpub-stat-info strong {
            display: block;
            font-size: 21px;
            color: #111827;
          }

          .stat-loading {
            display: inline-block;
            width: 17px;
            height: 17px;
            border: 2px solid #E5E7EB;
            border-top-color: #00A4A6;
            border-radius: 50%;
            animation: partnerPubSpin 0.7s linear infinite;
          }

          

          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
            gap: 15px;
          }

          .section-header h2 {
            margin: 0;
            font-size: 19px;
            color: #111827;
          }

          .section-header p {
            margin: 4px 0 0;
            color: #9CA3AF;
            font-size: 13px;
          }

          .refresh-button {
            width: 40px;
            height: 40px;
            border: 1px solid #e1e6e9;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #56606f;
            transition: 0.2s;
          }

          .refresh-button:hover {
            border-color: #00A4A6;
            color: #00A4A6;
          }

          .refresh-icon-spin {
            animation: partnerPubSpin 0.8s linear infinite;
          }

          

          

          .partnerpub-lower {
            display: grid;
            grid-template-columns: 1.35fr 0.95fr;
            gap: 20px;
          }

          .partnerpub-panel {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
          }

          

          .partnerpub-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .form-group.full {
            grid-column: 1 / -1;
          }

          .form-label {
            display: flex;
            align-items: center;
            gap: 7px;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
          }

          .form-label svg {
            color: #00A4A6;
          }

          .form-input-wrapper {
            position: relative;
          }

          .form-input {
            width: 100%;
            height: 45px;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            padding: 0 13px;
            color: #111827;
            background: #ffffff;
            outline: none;
            font-size: 13px;
            transition: 0.2s;
          }

          .form-input:focus {
            border-color: #00A4A6;
            box-shadow: 0 0 0 3px rgba(0,164,166,0.09);
          }

          .form-input.password {
            padding-right: 45px;
          }

          .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            border: none;
            background: transparent;
            color: #9CA3AF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .password-toggle:hover {
            color: #00A4A6;
          }

          .form-help {
            margin: 0;
            color: #9CA3AF;
            font-size: 11px;
          }

          .save-button {
            grid-column: 1 / -1;
            height: 45px;
            border: none;
            border-radius: 10px;
            background: #00A4A6;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
          }

          .save-button:hover {
            background: #00898B;
          }

          .save-button:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .save-spinner {
            width: 17px;
            height: 17px;
            border: 2px solid rgba(255,255,255,0.4);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: partnerPubSpin 0.7s linear infinite;
          }

          

          .promo-box {
            border-radius: 15px;
            background: #F8FFFF;
            border: 1px solid #D8F1F1;
            padding: 20px;
            margin-bottom: 18px;
          }

          .promo-box-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 13px;
            color: #00A4A6;
          }

          .promo-box-header strong {
            color: #111827;
            font-size: 15px;
          }

          .promo-code-display {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            background: #ffffff;
            border: 1px dashed #A7DCDC;
            border-radius: 11px;
            padding: 13px 14px;
          }

          .promo-code-display strong {
            color: #00A4A6;
            font-size: 19px;
            letter-spacing: 1px;
            word-break: break-all;
          }

          .copy-button {
            flex-shrink: 0;
            width: 38px;
            height: 38px;
            border: 1px solid #D8F1F1;
            background: #F8FFFF;
            color: #00A4A6;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.2s;
          }

          .copy-button:hover {
            background: #E8F8F8;
          }

          .promo-description {
            margin: 12px 0 0;
            color: #6B7280;
            font-size: 12px;
            line-height: 1.6;
          }

          

          .revenue-summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
          }

          .revenue-mini-card {
            border: 1px solid #EEF0F2;
            border-radius: 12px;
            padding: 14px;
            background: #ffffff;
          }

          .revenue-mini-card span {
            display: block;
            color: #9CA3AF;
            font-size: 11px;
            margin-bottom: 5px;
          }

          .revenue-mini-card strong {
            color: #111827;
            font-size: 16px;
          }

          

          .security-box {
            margin-top: 15px;
            padding: 14px;
            border-radius: 12px;
            background: #F8FAFC;
            border: 1px solid #EEF0F2;
            display: flex;
            gap: 10px;
            align-items: flex-start;
          }

          .security-box svg {
            color: #16A34A;
            flex-shrink: 0;
            margin-top: 1px;
          }

          .security-box strong {
            display: block;
            color: #374151;
            font-size: 12px;
            margin-bottom: 4px;
          }

          .security-box p {
            margin: 0;
            color: #9CA3AF;
            font-size: 11px;
            line-height: 1.5;
          }

          

          .info-box {
            border-radius: 14px;
            background: #F8FFFF;
            border: 1px solid #D8F1F1;
            padding: 18px;
          }

          .info-box-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            color: #00A4A6;
          }

          .info-box-header strong {
            color: #111827;
            font-size: 15px;
          }

          .info-box p {
            margin: 0;
            color: #6B7280;
            font-size: 13px;
            line-height: 1.6;
          }

          

          .logout-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 22px;
          }

          .logout-button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #FECACA;
            background: #FFF8F8;
            color: #DC2626;
            padding: 11px 17px;
            border-radius: 11px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
          }

          .logout-button:hover {
            background: #FEE2E2;
          }

          

          @media (max-width: 1200px) {

            .partnerpub-lower {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 900px) {
            .partnerpub-stats {
              grid-template-columns: repeat(2, 1fr);
            }

            .partnerpub-header {
              padding: 24px;
            }
          }

          @media (max-width: 650px) {
            .partnerpub-page {
              padding: 15px 13px 90px;
            }

            .partnerpub-header {
              flex-direction: column;
              align-items: flex-start;
              padding: 21px;
              border-radius: 17px;
            }

            .partnerpub-header-left {
              align-items: flex-start;
            }

            .partnerpub-logo {
              width: 55px;
              height: 55px;
            }

            .partnerpub-heading h1 {
              font-size: 22px;
            }

            .partnerpub-heading p {
              font-size: 12px;
            }

            .partnerpub-header-right {
              width: 100%;
              align-items: stretch;
            }

            .partnerpub-badge,
            .promo-header {
              width: 100%;
              justify-content: center;
            }

            .partnerpub-stats {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }

            .partnerpub-stat {
              padding: 15px;
              gap: 10px;
            }

            .partnerpub-stat-icon {
              width: 42px;
              height: 42px;
            }

            .partnerpub-stat-info strong {
              font-size: 17px;
            }

            .partnerpub-panel {
              padding: 18px;
            }

            .partnerpub-form {
              grid-template-columns: 1fr;
            }

            .form-group.full {
              grid-column: auto;
            }

            .save-button {
              grid-column: auto;
            }

            .logout-container {
              justify-content: center;
            }
          }

          @media (max-width: 420px) {
            .partnerpub-stats {
              grid-template-columns: 1fr;
            }

            .partnerpub-header-left {
              gap: 12px;
            }

            .partnerpub-heading h1 {
              font-size: 20px;
            }

            .revenue-summary {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="partnerpub-page">
        <div className="partnerpub-wrapper">

          <header className="partnerpub-header">

            <div className="partnerpub-header-left">

              <div className="partnerpub-logo">
                <Store size={34} />
              </div>

              <div className="partnerpub-heading">

                <h1>
                  Bonjour
                  {partnerpub?.fullname
                    ? `, ${partnerpub.fullname}`
                    : ""}
                </h1>

                <p>
                  Bienvenue dans votre espace PartnerPub Founa.
                </p>

              </div>

            </div>

            <div className="partnerpub-header-right">

              <div className="promo-header">
                <Tag size={16} />
                <span>Code promo :</span>
                <strong>
                  {partnerpub?.code_promo || "-"}
                </strong>
              </div>

              <div className="partnerpub-badge">
                <UserRound size={16} />
                Espace PartnerPub
              </div>

            </div>

          </header>

          <div className="section-header">

            <div>
              <h2>
                Actions
              </h2>

              <p>
                Gérez votre profil et consultez vos performances.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={refreshStatistics}
              title="Actualiser les statistiques"
            >
              <RefreshCw
                size={18}
                className={
                  loadingStatistics
                    ? "refresh-icon-spin"
                    : ""
                }
              />
            </button>

          </div>


            <div
              className="partnerpub-panel"
              id="partnerpub-profile"
            >

              <div className="section-header">

                <div>
                  <h2>
                    Mes informations
                  </h2>

                  <p>
                    Modifiez les informations de votre compte PartnerPub.
                  </p>
                </div>

              </div>

              <form
                className="partnerpub-form"
                onSubmit={handleUpdate}
              >

                <div className="form-group">

                  <label className="form-label">
                    <UserRound size={15} />
                    Nom complet
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    <Mail size={15} />
                    Adresse email
                  </label>

                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Votre adresse email"
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    <Phone size={15} />
                    Téléphone
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Votre numéro de téléphone"
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    <Tag size={15} />
                    Code promo
                  </label>

                  <input
                    className="form-input"
                    type="text"
                    name="code_promo"
                    value={formData.code_promo}
                    onChange={handleChange}
                    placeholder="Votre code promo"
                  />

                  <p className="form-help">
                    Le code doit rester unique.
                  </p>

                </div>

                <div className="form-group full">

                  <label className="form-label">
                    <KeyRound size={15} />
                    Nouveau mot de passe
                  </label>

                  <div className="form-input-wrapper">

                    <input
                      className="form-input password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Laisser vide pour conserver l'actuel"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  <p className="form-help">
                    Laissez ce champ vide si vous ne souhaitez pas modifier votre mot de passe.
                  </p>

                </div>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <span className="save-spinner"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Enregistrer les modifications
                    </>
                  )}

                </button>

              </form>

            </div><br />

          <div className="partnerpub-stats">

            <div className="partnerpub-stat">

              <div className="partnerpub-stat-icon stat-teal">
                <Users size={23} />
              </div>

              <div className="partnerpub-stat-info">

                <span>
                  Utilisateurs du code
                </span>

                {loadingStatistics ? (
                  <span className="stat-loading"></span>
                ) : (
                  <strong>
                    {statistics.nombreUtilisateurs}
                  </strong>
                )}

              </div>

            </div>

            <div className="partnerpub-stat">

              <div className="partnerpub-stat-icon stat-blue">
                <BarChart3 size={23} />
              </div>

              <div className="partnerpub-stat-info">

                <span>
                  Commandes livrées
                </span>

                {loadingStatistics ? (
                  <span className="stat-loading"></span>
                ) : (
                  <strong>
                    {statistics.nombreCommandesLivrees}
                  </strong>
                )}

              </div>

            </div>

            <div className="partnerpub-stat">

              <div className="partnerpub-stat-icon stat-green">
                <Wallet size={23} />
              </div>

              <div className="partnerpub-stat-info">

                <span>
                  Revenu total
                </span>

                {loadingStatistics ? (
                  <span className="stat-loading"></span>
                ) : (
                  <strong>
                    {formatMoney(
                      statistics.revenuTotal
                    )}{" "}
                    FCFA
                  </strong>
                )}

              </div>

            </div>

            <div className="partnerpub-stat">

              <div className="partnerpub-stat-icon stat-orange">
                <TrendingUp size={23} />
              </div>

              <div className="partnerpub-stat-info">

                <span>
                  Dernier mois
                </span>

                {loadingStatistics ? (
                  <span className="stat-loading"></span>
                ) : (
                  <strong>
                    {formatMoney(
                      getLastMonthlyRevenue()
                    )}{" "}
                    FCFA
                  </strong>
                )}

              </div>

            </div>

          </div>

         

          <div className="partnerpub-lower">

            

            <div
              className="partnerpub-panel"
              id="partnerpub-statistics"
            >

              <div className="section-header">

                <div>
                  <h2>
                    Mon activité
                  </h2>

                  <p>
                    Résumé de votre activité PartnerPub.
                  </p>
                </div>

              </div>

              <div className="promo-box">

                <div className="promo-box-header">

                  <Tag size={19} />

                  <strong>
                    Mon code promo
                  </strong>

                </div>

                <div className="promo-code-display">

                  <strong>
                    {partnerpub?.code_promo || "-"}
                  </strong>

                  <button
                    type="button"
                    className="copy-button"
                    onClick={handleCopyCode}
                    title="Copier le code promo"
                  >
                    {copied ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>

                </div>

                <p className="promo-description">
                  Partagez ce code avec vos utilisateurs.
                  Les commandes livrées associées à ce code
                  génèrent une commission de 1 % sur le prix total.
                </p>

              </div>

              <div className="revenue-summary">

                <div className="revenue-mini-card">

                  <span>
                    Commandes livrées
                  </span>

                  <strong>
                    {statistics.nombreCommandesLivrees}
                  </strong>

                </div>

                <div className="revenue-mini-card">

                  <span>
                    Revenu total
                  </span>

                  <strong>
                    {formatMoney(
                      statistics.revenuTotal
                    )}{" "}
                    FCFA
                  </strong>

                </div>

              </div>

              <div className="info-box" style={{ marginTop: 15 }}>

                <div className="info-box-header">

                  <Store size={19} />

                  <strong>
                    Espace PartnerPub Founa
                  </strong>

                </div>

                <p>
                  Depuis cet espace, vous pouvez gérer
                  vos informations personnelles, consulter
                  vos performances et suivre l'utilisation
                  de votre code promo.
                </p>

              </div>

              <div className="security-box">

                <ShieldCheck size={18} />

                <div>

                  <strong>
                    Protection du compte
                  </strong>

                  <p>
                    Votre espace est réservé à votre compte PartnerPub.
                    Ne partagez jamais votre mot de passe.
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="logout-container">

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Déconnexion
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default HomePartnerPub;