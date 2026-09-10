import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import { CreateOneTeller } from "../../services/teller.service";

interface TellerForm {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
}

const CreateTeller: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<TellerForm>({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePassword = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%";

    let password = "";

    for (let i = 0; i < 12; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setForm((prev) => ({
      ...prev,
      password,
      confirmpassword: password,
    }));

    setShowPassword(true);
    setShowConfirmPassword(true);
  };

  const getInitials = () => {
    if (!form.fullname.trim()) {
      return "T";
    }

    const parts = form.fullname
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) {
      return {
        level: 0,
        label: "Aucun mot de passe",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        level: 1,
        label: "Faible",
      };
    }

    if (score === 3) {
      return {
        level: 2,
        label: "Moyenne",
      };
    }

    if (score === 4) {
      return {
        level: 3,
        label: "Bonne",
      };
    }

    return {
      level: 4,
      label: "Très sécurisée",
    };
  };

  const passwordStrength = getPasswordStrength();

  const validateForm = () => {
    if (!form.fullname.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nom requis",
        text: "Veuillez renseigner le nom complet du Teller.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (!form.email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email requis",
        text: "Veuillez renseigner l'adresse email du Teller.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Email invalide",
        text: "Veuillez renseigner une adresse email valide.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (!form.phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Téléphone requis",
        text: "Veuillez renseigner le numéro de téléphone.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (!form.password) {
      Swal.fire({
        icon: "warning",
        title: "Mot de passe requis",
        text: "Veuillez renseigner un mot de passe.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (form.password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Mot de passe trop court",
        text: "Le mot de passe doit contenir au moins 8 caractères.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (!form.confirmpassword) {
      Swal.fire({
        icon: "warning",
        title: "Confirmation requise",
        text: "Veuillez confirmer le mot de passe.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    if (form.password !== form.confirmpassword) {
      Swal.fire({
        icon: "warning",
        title: "Mots de passe différents",
        text: "Les deux mots de passe ne correspondent pas.",
        confirmButtonColor: "#00A4A6",
      });

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await CreateOneTeller({
        fullname: form.fullname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmpassword: form.confirmpassword,
      });

      if (response.data.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Teller créé",
          text:
            response.data.message ||
            "Le compte Teller a été créé avec succès.",
          confirmButtonColor: "#00A4A6",
        });

        setForm({
          fullname: "",
          email: "",
          phone: "",
          password: "",
          confirmpassword: "",
        });

        navigate(-1);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Création impossible",
          text:
            response.data.message ||
            response.data.error_description ||
            "Impossible de créer le Teller.",
          confirmButtonColor: "#00A4A6",
        });
      }
    } catch (error: any) {
      console.error(
        "Erreur création Teller :",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "Erreur serveur",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error_description ||
          "Une erreur est survenue lors de la création du Teller.",
        confirmButtonColor: "#00A4A6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-teller-page">
      <style>{`

        * {
          box-sizing: border-box;
        }

        .create-teller-page {
          min-height: 100vh;
          width: 100%;
          padding: 28px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(0, 164, 166, 0.10),
              transparent 30%
            ),
            #f5f7f9;
          color: #172033;
        }

        .create-teller-container {
          width: 100%;
          max-width: 1250px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .back-button {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border: 1px solid #e1e6eb;
          border-radius: 13px;
          background: #ffffff;
          color: #475467;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
        }

        .back-button:hover {
          background: #00A4A6;
          border-color: #00A4A6;
          color: #ffffff;
          transform: translateX(-2px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #98a2b3;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .breadcrumb span {
          color: #cbd2d9;
        }

        .page-title {
          margin: 0;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 850;
          line-height: 1.15;
          letter-spacing: -0.8px;
          color: #101828;
        }

        .page-subtitle {
          margin: 7px 0 0;
          color: #7b8494;
          font-size: 14px;
          line-height: 1.5;
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 30px;
          background: #eafafa;
          color: #00898b;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* ================= LAYOUT ================= */

        .teller-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(290px, 0.75fr);
          gap: 24px;
          align-items: start;
        }

        .form-card,
        .side-card {
          background: #ffffff;
          border: 1px solid #e7ebef;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.055);
        }

        /* ================= FORM ================= */

        .form-card {
          overflow: hidden;
        }

        .card-header {
          padding: 23px 27px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-bottom: 1px solid #edf0f3;
        }

        .card-header-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 12px;
          background: #eafafa;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          margin: 0;
          color: #172033;
          font-size: 18px;
          font-weight: 800;
        }

        .card-subtitle {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 12px;
        }

        .form-content {
          padding: 27px;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 17px;
          color: #344054;
          font-size: 14px;
          font-weight: 800;
        }

        .section-line {
          width: 4px;
          height: 17px;
          border-radius: 5px;
          background: #00A4A6;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .field-full {
          grid-column: 1 / -1;
        }

        .field-label {
          display: block;
          margin-bottom: 8px;
          color: #475467;
          font-size: 12px;
          font-weight: 800;
        }

        .required {
          color: #e5484d;
          margin-left: 3px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          height: 50px;
          padding: 0 14px 0 43px;
          border: 1px solid #dfe4ea;
          border-radius: 11px;
          outline: none;
          background: #fbfcfd;
          color: #172033;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .form-input:hover {
          border-color: #cbd3dc;
        }

        .form-input:focus {
          background: #ffffff;
          border-color: #00A4A6;
          box-shadow: 0 0 0 4px rgba(0, 164, 166, 0.09);
        }

        .form-input::placeholder {
          color: #b0b8c4;
        }

        .password-input {
          padding-right: 91px;
        }

        .password-tools {
          position: absolute;
          right: 7px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 2px;
        }

        .password-tool {
          width: 35px;
          height: 35px;
          border: 0;
          background: transparent;
          color: #8993a3;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .password-tool:hover {
          color: #00A4A6;
          background: #edfafa;
        }

        /* ================= PASSWORD ================= */

        .strength-wrapper {
          margin-top: 9px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          margin-bottom: 6px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          border-radius: 5px;
          background: #e8edf1;
        }

        .strength-bar.active {
          background: #00A4A6;
        }

        .strength-text {
          color: #98a2b3;
          font-size: 10px;
        }

        .strength-text strong {
          color: #667085;
        }

        .password-match {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          color: #16a34a;
          font-size: 11px;
          font-weight: 700;
        }

        /* ================= FOOTER ================= */

        .form-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          padding-top: 24px;
          border-top: 1px solid #edf0f3;
        }

        .cancel-button,
        .submit-button {
          min-height: 46px;
          padding: 0 19px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button {
          border: 1px solid #dfe4ea;
          background: #ffffff;
          color: #667085;
        }

        .cancel-button:hover:not(:disabled) {
          background: #f8fafb;
        }

        .submit-button {
          min-width: 170px;
          border: 0;
          background: #00A4A6;
          color: #ffffff;
          box-shadow: 0 8px 18px rgba(0, 164, 166, 0.20);
        }

        .submit-button:hover:not(:disabled) {
          background: #008f91;
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(0, 164, 166, 0.25);
        }

        .cancel-button:disabled,
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ================= SIDEBAR ================= */

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: sticky;
          top: 22px;
        }

        .side-card {
          padding: 23px;
        }

        .profile-preview {
          display: flex;
          align-items: center;
          gap: 13px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid #edf0f3;
        }

        .avatar {
          width: 58px;
          height: 58px;
          min-width: 58px;
          border-radius: 17px;
          background: linear-gradient(
            135deg,
            #00A4A6,
            #007d80
          );
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 850;
          box-shadow: 0 8px 18px rgba(0, 164, 166, 0.20);
        }

        .preview-name {
          margin: 0;
          color: #172033;
          font-size: 15px;
          font-weight: 800;
          word-break: break-word;
        }

        .preview-email {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 11px;
          word-break: break-word;
        }

        .side-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 17px;
          color: #172033;
          font-size: 14px;
          font-weight: 800;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #667085;
          font-size: 11px;
          line-height: 1.5;
        }

        .benefit svg {
          min-width: 16px;
          color: #00A4A6;
          margin-top: 1px;
        }

        .security-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border-radius: 12px;
          background: #f0fbfb;
          border: 1px solid #d8f1f1;
        }

        .security-box svg {
          min-width: 19px;
          color: #00A4A6;
        }

        .security-box strong {
          display: block;
          margin-bottom: 3px;
          color: #176b6d;
          font-size: 11px;
        }

        .security-box span {
          display: block;
          color: #5f7f80;
          font-size: 10px;
          line-height: 1.5;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1050px) {

          .create-teller-page {
            padding: 22px;
          }

          .teller-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .security-card {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 760px) {

          .create-teller-page {
            padding: 16px;
          }

          .page-header {
            align-items: flex-start;
          }

          .header-status {
            display: none;
          }

          .fields-grid {
            grid-template-columns: 1fr;
          }

          .field-full {
            grid-column: auto;
          }

          .sidebar {
            display: flex;
          }

          .form-content {
            padding: 22px 18px;
          }

          .card-header {
            padding: 20px 18px;
          }
        }

        @media (max-width: 520px) {

          .create-teller-page {
            padding: 10px;
          }

          .page-header {
            margin-bottom: 18px;
          }

          .header-left {
            gap: 10px;
          }

          .back-button {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .breadcrumb {
            font-size: 10px;
          }

          .page-title {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 11px;
          }

          .form-card,
          .side-card {
            border-radius: 16px;
          }

          .card-header {
            padding: 17px 15px;
          }

          .card-header-icon {
            width: 39px;
            height: 39px;
            min-width: 39px;
          }

          .card-title {
            font-size: 15px;
          }

          .card-subtitle {
            font-size: 10px;
          }

          .form-content {
            padding: 18px 14px;
          }

          .form-input {
            height: 47px;
            font-size: 12px;
          }

          .form-footer {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .submit-button {
            width: 100%;
          }

          .side-card {
            padding: 18px;
          }
        }

        @media (max-width: 360px) {

          .create-teller-page {
            padding: 7px;
          }

          .page-title {
            font-size: 20px;
          }

          .form-content {
            padding: 15px 11px;
          }

          .card-header {
            padding: 14px 11px;
          }

          .form-input {
            padding-left: 39px;
          }
        }

        @keyframes tellerSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .teller-spin {
          animation: tellerSpin 0.8s linear infinite;
        }

      `}</style>

      <div className="create-teller-container">

        {/* ================= HEADER ================= */}

        <header className="page-header">

          <div className="header-left">

            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
              title="Retour"
            >
              <ArrowLeft size={20} />
            </button>

            <div>

              <div className="breadcrumb">
                Administration
                <span>/</span>
                Tellers
                <span>/</span>
                Création
              </div>

              <h1 className="page-title">
                Créer un Teller
              </h1>

              <p className="page-subtitle">
                Ajoutez un nouveau collaborateur à votre
                équipe Founa.
              </p>

            </div>

          </div>

          <div className="header-status">
            <ShieldCheck size={16} />
            Création sécurisée
          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <div className="teller-grid">

          {/* ================= FORMULAIRE ================= */}

          <div className="form-card">

            <div className="card-header">

              <div className="card-header-icon">
                <UserPlus size={21} />
              </div>

              <div>

                <h2 className="card-title">
                  Informations du Teller
                </h2>

                <p className="card-subtitle">
                  Renseignez les informations du nouveau
                  collaborateur.
                </p>

              </div>

            </div>

            <form
              className="form-content"
              onSubmit={handleSubmit}
            >

              {/* INFORMATIONS PERSONNELLES */}

              <div className="form-section">

                <div className="section-heading">
                  <span className="section-line" />
                  Informations personnelles
                </div>

                <div className="fields-grid">

                  <div className="field-full">

                    <label className="field-label">
                      Nom complet
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrapper">

                      <User
                        size={17}
                        className="input-icon"
                      />

                      <input
                        type="text"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ex : Kouassi Jean"
                        autoComplete="name"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="field-label">
                      Adresse email
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrapper">

                      <Mail
                        size={17}
                        className="input-icon"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ex : jean@founa.ci"
                        autoComplete="email"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="field-label">
                      Numéro de téléphone
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrapper">

                      <Phone
                        size={17}
                        className="input-icon"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ex : 07 00 00 00 00"
                        autoComplete="tel"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* SECURITE */}

              <div className="form-section">

                <div className="section-heading">
                  <span className="section-line" />
                  Sécurité du compte
                </div>

                <div className="fields-grid">

                  {/* PASSWORD */}

                  <div>

                    <label className="field-label">
                      Mot de passe
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrapper">

                      <Lock
                        size={17}
                        className="input-icon"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-input password-input"
                        placeholder="Minimum 8 caractères"
                        autoComplete="new-password"
                      />

                      <div className="password-tools">

                        <button
                          type="button"
                          className="password-tool"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          title={
                            showPassword
                              ? "Masquer"
                              : "Afficher"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          className="password-tool"
                          onClick={generatePassword}
                          title="Générer un mot de passe"
                        >
                          <RefreshCw size={15} />
                        </button>

                      </div>

                    </div>

                    {form.password && (
                      <div className="strength-wrapper">

                        <div className="strength-bars">

                          {[1, 2, 3, 4].map(
                            (level) => (
                              <span
                                key={level}
                                className={
                                  "strength-bar " +
                                  (
                                    passwordStrength.level >=
                                    level
                                      ? "active"
                                      : ""
                                  )
                                }
                              />
                            )
                          )}

                        </div>

                        <div className="strength-text">
                          Sécurité :{" "}
                          <strong>
                            {
                              passwordStrength.label
                            }
                          </strong>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="field-label">
                      Confirmer le mot de passe
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrapper">

                      <Lock
                        size={17}
                        className="input-icon"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmpassword"
                        value={form.confirmpassword}
                        onChange={handleChange}
                        className="form-input password-input"
                        placeholder="Confirmez le mot de passe"
                        autoComplete="new-password"
                      />

                      <div className="password-tools">

                        <button
                          type="button"
                          className="password-tool"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          title={
                            showConfirmPassword
                              ? "Masquer"
                              : "Afficher"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                      </div>

                    </div>

                    {form.confirmpassword &&
                      form.password ===
                        form.confirmpassword && (
                        <div className="password-match">

                          <CheckCircle2 size={14} />

                          Les mots de passe
                          correspondent

                        </div>
                      )}

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="form-footer">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="teller-spin"
                      />
                      Création...
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Créer le Teller
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

          {/* ================= SIDEBAR ================= */}

          <aside className="sidebar">

            {/* APERCU */}

            <div className="side-card">

              <div className="profile-preview">

                <div className="avatar">
                  {getInitials()}
                </div>

                <div>

                  <p className="preview-name">
                    {form.fullname.trim() ||
                      "Nouveau Teller"}
                  </p>

                  <p className="preview-email">
                    {form.email.trim() ||
                      "Adresse email"}
                  </p>

                </div>

              </div>

              <h3 className="side-title">
                <Users size={17} />
                Aperçu du compte
              </h3>

              <div className="benefits">

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Le nouveau Teller disposera de son
                    propre compte.
                  </span>
                </div>

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Il pourra accéder à son espace Teller
                    après connexion.
                  </span>
                </div>

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Les commandes qui lui sont attribuées
                    seront accessibles depuis son espace.
                  </span>
                </div>

              </div>

            </div>

            {/* SECURITE */}

            <div className="side-card">

              <h3 className="side-title">
                <Lock size={16} />
                Sécurité
              </h3>

              <div className="benefits">

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Utilisez au minimum 8 caractères.
                  </span>
                </div>

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Combinez lettres, chiffres et caractères
                    spéciaux.
                  </span>
                </div>

                <div className="benefit">
                  <CheckCircle2 size={16} />
                  <span>
                    Le bouton de génération permet de créer
                    automatiquement un mot de passe.
                  </span>
                </div>

              </div>

            </div>

            {/* MESSAGE SECURITE */}

            <div className="side-card security-card">

              <div className="security-box">

                <ShieldCheck size={19} />

                <div>

                  <strong>
                    Compte Teller
                  </strong>

                  <span>
                    Vérifiez les informations avant de créer
                    le compte afin d'éviter toute erreur.
                  </span>

                </div>

              </div>

            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default CreateTeller;