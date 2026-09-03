// src/pages/ProfilePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  Edit3,
  Lock,
  LogOut,
  ChevronRight,
  CalendarDays,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import { ReadSingleClient } from "../../services/auth.service";
import { GetAllCommandeByClient } from "../../services/order.service";
import { useNavigate } from "react-router-dom";

interface User {
  fullname: string;
  email: string;
  phone: string;
  adresse_livraison: string;
  uid: string;
}

interface Order {
  commande_id: string;
  client_id: string;
  produit_id: string;
  nom: string;
  teller_id: string;
  fournisseur_id: string;
  quantite: number;
  prix_total: number;
  statut: string;
  details: string;
  created_date: string;
  updated_date?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const client = JSON.parse(localStorage.getItem("user") || "null");
  const uid = client?.uid;

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);

      try {
        const [clientResponse, ordersResponse] = await Promise.all([
          ReadSingleClient({ uid }),
          GetAllCommandeByClient({ client_id: uid }),
        ]);

        if (clientResponse.data.status === "success") {
          setUser(clientResponse.data.client);
        }

        if (ordersResponse.data.status === "success") {
          setOrders(ordersResponse.data.commandes || []);
        }
      } catch (error) {
        console.error("Erreur chargement profil :", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [uid]);

  // =========================================================
  // STATISTIQUES
  // =========================================================

  const statistics = useMemo(() => {
    const total = orders.length;

    const enCours = orders.filter(
      (order) =>
        order.statut === "Initier" ||
        order.statut === "Prise en charge" ||
        order.statut === "Valider" ||
        order.statut === "Payer" ||
        order.statut === "Expedition" ||
        order.statut === "Livraison"
    ).length;

    const livrees = orders.filter(
      (order) => order.statut === "Livrer"
    ).length;

    const totalDepense = orders
      .filter(
        (order) =>
          order.statut === "Payer" ||
          order.statut === "Expedition" ||
          order.statut === "Livraison" ||
          order.statut === "Livrer"
      )
      .reduce((total, order) => total + Number(order.prix_total || 0), 0);

    return {
      total,
      enCours,
      livrees,
      totalDepense,
    };
  }, [orders]);

  // =========================================================
  // STATUT
  // =========================================================

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Initier":
        return {
          color: "#6B7280",
          background: "#F3F4F6",
          label: "Initiée",
        };

      case "Prise en charge":
        return {
          color: "#2196F3",
          background: "#EFF6FF",
          label: "Prise en charge",
        };

      case "Valider":
        return {
          color: "#3F51B5",
          background: "#EEF2FF",
          label: "Validée",
        };

      case "Payer":
        return {
          color: "#B7791F",
          background: "#FFFBEB",
          label: "Payée",
        };

      case "Expedition":
        return {
          color: "#EA580C",
          background: "#FFF7ED",
          label: "Expédiée",
        };

      case "Livraison":
        return {
          color: "#0891B2",
          background: "#ECFEFF",
          label: "En livraison",
        };

      case "Livrer":
        return {
          color: "#16A34A",
          background: "#F0FDF4",
          label: "Livrée",
        };

      default:
        return {
          color: "#6B7280",
          background: "#F3F4F6",
          label: status,
        };
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // COMMANDES RECENTES
  // =========================================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  // =========================================================
  // DECONNEXION
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/home";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes profileSpin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .profile-loader {
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

            .profile-spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #E5E7EB;
              border-top-color: #00A4A6;
              border-radius: 50%;
              animation: profileSpin 0.8s linear infinite;
            }
          `}
        </style>

        <div className="profile-loader">
          <div className="profile-spinner"></div>
        </div>
      </>
    );
  }

  // =========================================================
  // UTILISATEUR NON CONNECTE
  // =========================================================

  if (!uid) {
    return (
      <>
        <style>
          {`
            .profile-login-page {
              min-height: 100vh;
              background: #F5F7F8;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 24px;
              box-sizing: border-box;
            }

            .profile-login-card {
              width: 100%;
              max-width: 460px;
              background: #ffffff;
              border-radius: 24px;
              padding: 42px 34px;
              text-align: center;
              box-shadow: 0 15px 50px rgba(0,0,0,0.08);
            }

            .profile-login-icon {
              width: 78px;
              height: 78px;
              margin: 0 auto 20px;
              border-radius: 50%;
              background: #E8F8F8;
              color: #00A4A6;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .profile-login-title {
              margin: 0 0 12px;
              font-size: 25px;
              color: #111827;
            }

            .profile-login-text {
              margin: 0 0 28px;
              color: #6B7280;
              line-height: 1.6;
              font-size: 14px;
            }

            .profile-login-btn,
            .profile-register-btn {
              width: 100%;
              border-radius: 12px;
              padding: 14px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              transition: 0.2s;
            }

            .profile-login-btn {
              border: none;
              background: #00A4A6;
              color: #ffffff;
              margin-bottom: 10px;
            }

            .profile-register-btn {
              border: 1px solid #00A4A6;
              background: #ffffff;
              color: #00A4A6;
            }

            .profile-login-btn:hover {
              background: #008F91;
            }

            .profile-register-btn:hover {
              background: #E8F8F8;
            }
          `}
        </style>

        <div className="profile-login-page">
          <div className="profile-login-card">
            <div className="profile-login-icon">
              <User size={38} />
            </div>

            <h2 className="profile-login-title">
              Vous n'êtes pas connecté
            </h2>

            <p className="profile-login-text">
              Connectez-vous pour accéder à votre profil,
              consulter vos commandes et gérer vos informations personnelles.
            </p>

            <button
              className="profile-login-btn"
              onClick={() => navigate("/auth/login")}
            >
              Se connecter
            </button>

            <button
              className="profile-register-btn"
              onClick={() => navigate("/auth/register")}
            >
              Créer un compte
            </button>
          </div>
        </div>
      </>
    );
  }

  // =========================================================
  // PAGE PROFIL
  // =========================================================

  if (!user) {
    return null;
  }

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .profile-page {
            min-height: 100vh;
            width: 100%;
            background: #F5F7F8;
            padding: 24px 24px 110px;
            font-family: Arial, Helvetica, sans-serif;
          }

          .profile-wrapper {
            width: 100%;
            max-width: 1450px;
            margin: 0 auto;
          }

          /* HEADER */

          .profile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 24px;
          }

          .profile-header-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .profile-back {
            width: 42px;
            height: 42px;
            border: none;
            background: #ffffff;
            color: #374151;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 3px 12px rgba(0,0,0,0.05);
            transition: 0.2s;
          }

          .profile-back:hover {
            color: #00A4A6;
            transform: translateX(-2px);
          }

          .profile-heading h1 {
            margin: 0;
            font-size: 28px;
            color: #111827;
          }

          .profile-heading p {
            margin: 5px 0 0;
            color: #6B7280;
            font-size: 14px;
          }

          /* PROFILE HERO */

          .profile-hero {
            background: linear-gradient(135deg, #00A4A6 0%, #00898B 100%);
            border-radius: 22px;
            padding: 30px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
            margin-bottom: 22px;
            box-shadow: 0 12px 35px rgba(0,164,166,0.20);
          }

          .profile-identity {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .profile-avatar {
            width: 82px;
            height: 82px;
            border-radius: 50%;
            background: rgba(255,255,255,0.20);
            border: 3px solid rgba(255,255,255,0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .profile-identity h2 {
            margin: 0 0 7px;
            font-size: 25px;
          }

          .profile-identity p {
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
          }

          .profile-hero-actions {
            display: flex;
            gap: 10px;
          }

          .hero-action {
            border: none;
            padding: 12px 16px;
            border-radius: 10px;
            background: rgba(255,255,255,0.17);
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.2s;
          }

          .hero-action:hover {
            background: rgba(255,255,255,0.28);
          }

          /* STATS */

          .profile-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 22px;
          }

          .profile-stat {
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .stat-icon.teal {
            background: #E8F8F8;
            color: #00A4A6;
          }

          .stat-icon.blue {
            background: #EFF6FF;
            color: #2196F3;
          }

          .stat-icon.green {
            background: #F0FDF4;
            color: #16A34A;
          }

          .stat-icon.orange {
            background: #FFF7ED;
            color: #EA580C;
          }

          .stat-info span {
            display: block;
            color: #6B7280;
            font-size: 13px;
            margin-bottom: 5px;
          }

          .stat-info strong {
            display: block;
            font-size: 21px;
            color: #111827;
          }

          /* CONTENT */

          .profile-content {
            display: grid;
            grid-template-columns: minmax(300px, 0.85fr) minmax(500px, 1.5fr);
            gap: 22px;
            align-items: start;
          }

          .profile-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          }

          .card-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
          }

          .card-title-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .card-title-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: #E8F8F8;
            color: #00A4A6;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card-title h3 {
            margin: 0;
            font-size: 18px;
            color: #111827;
          }

          /* INFORMATIONS */

          .info-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .info-row {
            display: flex;
            align-items: flex-start;
            gap: 13px;
            padding-bottom: 15px;
            border-bottom: 1px solid #F0F2F3;
          }

          .info-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .info-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: #F5F7F8;
            color: #00A4A6;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .info-content span {
            display: block;
            font-size: 12px;
            color: #9CA3AF;
            margin-bottom: 4px;
          }

          .info-content strong {
            display: block;
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
            word-break: break-word;
          }

          /* ACTIONS */

          .account-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 22px;
          }

          .account-action {
            width: 100%;
            border: 1px solid #E5E7EB;
            background: #ffffff;
            color: #374151;
            padding: 13px 15px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: 0.2s;
          }

          .account-action-left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
          }

          .account-action:hover {
            border-color: #00A4A6;
            color: #00A4A6;
            background: #F8FFFF;
          }

          .logout-action {
            color: #DC2626;
            border-color: #FEE2E2;
            background: #FFF8F8;
          }

          .logout-action:hover {
            border-color: #DC2626;
            color: #DC2626;
            background: #FFF1F2;
          }

          /* COMMANDES */

          .orders-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .order-item {
            border: 1px solid #EEF0F2;
            border-radius: 14px;
            padding: 17px;
            cursor: pointer;
            transition: 0.2s;
            background: #ffffff;
          }

          .order-item:hover {
            border-color: #00A4A6;
            transform: translateY(-1px);
            box-shadow: 0 5px 16px rgba(0,164,166,0.08);
          }

          .order-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 14px;
          }

          .order-reference {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .order-reference strong {
            color: #111827;
            font-size: 15px;
          }

          .order-reference span {
            color: #9CA3AF;
            font-size: 12px;
          }

          .order-status {
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
          }

          .order-main {
            display: grid;
            grid-template-columns: 1fr auto auto;
            align-items: center;
            gap: 18px;
          }

          .order-product {
            min-width: 0;
          }

          .order-product strong {
            display: block;
            font-size: 14px;
            color: #374151;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .order-product span {
            display: block;
            margin-top: 5px;
            color: #9CA3AF;
            font-size: 12px;
          }

          .order-amount {
            text-align: right;
          }

          .order-amount span {
            display: block;
            color: #9CA3AF;
            font-size: 11px;
            margin-bottom: 4px;
          }

          .order-amount strong {
            color: #00A4A6;
            font-size: 15px;
          }

          .order-arrow {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            background: #F5F7F8;
            color: #6B7280;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .order-item:hover .order-arrow {
            background: #E8F8F8;
            color: #00A4A6;
          }

          /* EMPTY */

          .empty-orders {
            padding: 45px 20px;
            text-align: center;
            border: 1px dashed #D1D5DB;
            border-radius: 14px;
          }

          .empty-icon {
            width: 55px;
            height: 55px;
            margin: 0 auto 12px;
            border-radius: 50%;
            background: #F3F4F6;
            color: #9CA3AF;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-orders strong {
            display: block;
            color: #374151;
            margin-bottom: 5px;
          }

          .empty-orders span {
            color: #9CA3AF;
            font-size: 13px;
          }

          /* RESPONSIVE */

          @media (max-width: 1100px) {
            .profile-content {
              grid-template-columns: 1fr;
            }

            .profile-stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 750px) {
            .profile-page {
              padding: 16px 14px 100px;
            }

            .profile-header {
              align-items: flex-start;
            }

            .profile-heading h1 {
              font-size: 23px;
            }

            .profile-hero {
              flex-direction: column;
              align-items: flex-start;
              padding: 22px;
            }

            .profile-hero-actions {
              width: 100%;
            }

            .hero-action {
              flex: 1;
              justify-content: center;
            }

            .profile-stats {
              grid-template-columns: 1fr 1fr;
            }

            .profile-card {
              padding: 18px;
            }

            .order-main {
              grid-template-columns: 1fr auto;
            }

            .order-arrow {
              grid-column: 2;
              grid-row: 1;
            }

            .order-amount {
              grid-column: 1;
              text-align: left;
            }
          }

          @media (max-width: 500px) {
            .profile-stats {
              grid-template-columns: 1fr;
            }

            .profile-identity {
              align-items: flex-start;
            }

            .profile-avatar {
              width: 65px;
              height: 65px;
            }

            .profile-identity h2 {
              font-size: 20px;
            }

            .profile-hero-actions {
              flex-direction: column;
            }

            .order-top {
              flex-direction: column;
            }

            .order-status {
              align-self: flex-start;
            }
          }
        `}
      </style>

      <div className="profile-page">
        <div className="profile-wrapper">

          {/* HEADER */}
          <div className="profile-header">
            <div className="profile-header-left">
              <div className="profile-heading">
                <h1>Mon profil</h1>
                <p>Gérez vos informations et consultez vos commandes</p>
              </div>
            </div>
          </div>

          {/* HERO PROFIL */}
          <div className="profile-hero">
            <div className="profile-identity">
              <div className="profile-avatar">
                <User size={42} />
              </div>

              <div>
                <h2>{user.fullname}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                className="hero-action"
                onClick={() => navigate("/update")}
              >
                <Edit3 size={17} />
                Modifier
              </button>

              <button
                className="hero-action"
                onClick={() => navigate("/updatepassword")}
              >
                <Lock size={17} />
                Mot de passe
              </button>
            </div>
          </div>

          {/* STATISTIQUES */}
          <div className="profile-stats">

            <div className="profile-stat">
              <div className="stat-icon teal">
                <ShoppingBag size={22} />
              </div>

              <div className="stat-info">
                <span>Total commandes</span>
                <strong>{statistics.total}</strong>
              </div>
            </div>

            <div className="profile-stat">
              <div className="stat-icon blue">
                <Clock size={22} />
              </div>

              <div className="stat-info">
                <span>En cours</span>
                <strong>{statistics.enCours}</strong>
              </div>
            </div>

            <div className="profile-stat">
              <div className="stat-icon green">
                <CheckCircle size={22} />
              </div>

              <div className="stat-info">
                <span>Commandes livrées</span>
                <strong>{statistics.livrees}</strong>
              </div>
            </div>

            <div className="profile-stat">
              <div className="stat-icon orange">
                <Wallet size={22} />
              </div>

              <div className="stat-info">
                <span>Total dépensé</span>
                <strong>
                  {statistics.totalDepense.toLocaleString()} FCFA
                </strong>
              </div>
            </div>

          </div>

          {/* CONTENU */}
          <div className="profile-content">

            {/* COLONNE GAUCHE */}
            <div>

              {/* INFORMATIONS PERSONNELLES */}
              <div className="profile-card">
                <div className="card-title">
                  <div className="card-title-left">
                    <div className="card-title-icon">
                      <User size={18} />
                    </div>

                    <h3>Informations personnelles</h3>
                  </div>
                </div>

                <div className="info-list">

                  <div className="info-row">
                    <div className="info-icon">
                      <User size={18} />
                    </div>

                    <div className="info-content">
                      <span>Nom complet</span>
                      <strong>{user.fullname || "-"}</strong>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-icon">
                      <Mail size={18} />
                    </div>

                    <div className="info-content">
                      <span>Adresse email</span>
                      <strong>{user.email || "-"}</strong>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-icon">
                      <Phone size={18} />
                    </div>

                    <div className="info-content">
                      <span>Téléphone</span>
                      <strong>{user.phone || "-"}</strong>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-icon">
                      <MapPin size={18} />
                    </div>

                    <div className="info-content">
                      <span>Adresse de livraison</span>
                      <strong>
                        {user.adresse_livraison || "Aucune adresse renseignée"}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="account-actions">

                  <button
                    className="account-action"
                    onClick={() => navigate("/update")}
                  >
                    <div className="account-action-left">
                      <Edit3 size={18} />
                      Modifier mes informations
                    </div>

                    <ChevronRight size={18} />
                  </button>

                  <button
                    className="account-action"
                    onClick={() => navigate("/updatepassword")}
                  >
                    <div className="account-action-left">
                      <Lock size={18} />
                      Modifier mon mot de passe
                    </div>

                    <ChevronRight size={18} />
                  </button>

                  <button
                    className="account-action logout-action"
                    onClick={handleLogout}
                  >
                    <div className="account-action-left">
                      <LogOut size={18} />
                      Se déconnecter
                    </div>

                    <ChevronRight size={18} />
                  </button>

                </div>
              </div>

            </div>

            {/* COLONNE DROITE */}
            <div className="profile-card">

              <div className="card-title">
                <div className="card-title-left">
                  <div className="card-title-icon">
                    <Package size={18} />
                  </div>

                  <h3>Commandes récentes</h3>
                </div>

                {orders.length > 5 && (
                  <button
                    onClick={() => navigate("/orders")}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#00A4A6",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Voir toutes
                  </button>
                )}
              </div>

              {recentOrders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">
                    <Package size={25} />
                  </div>

                  <strong>Aucune commande</strong>

                  <span>
                    Vous n'avez pas encore passé de commande.
                  </span>
                </div>
              ) : (
                <div className="orders-list">

                  {recentOrders.map((order) => {
                    const status = getStatusConfig(order.statut);

                    return (
                      <div
                        key={order.commande_id}
                        className="order-item"
                        onClick={() =>
                          navigate(`/order/${order.commande_id}`)
                        }
                      >

                        <div className="order-top">

                          <div className="order-reference">
                            <strong>
                              Commande #{order.commande_id}
                            </strong>

                            <span>
                              <CalendarDays
                                size={12}
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: 4,
                                }}
                              />

                              {formatDate(order.created_date)}
                            </span>
                          </div>

                          <span
                            className="order-status"
                            style={{
                              color: status.color,
                              background: status.background,
                            }}
                          >
                            {status.label}
                          </span>

                        </div>

                        <div className="order-main">

                          <div className="order-product">
                            <strong>
                              {order.nom || "Produit"}
                            </strong>

                            <span>
                              Quantité : {order.quantite}
                            </span>
                          </div>

                          <div className="order-amount">
                            <span>Total</span>

                            <strong>
                              {Number(order.prix_total || 0).toLocaleString()} FCFA
                            </strong>
                          </div>

                          <div className="order-arrow">
                            <ChevronRight size={18} />
                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;