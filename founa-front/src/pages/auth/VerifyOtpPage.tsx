import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verfiy_OTP } from "../../services/auth.service";

const Toast: React.FC<{
  message: string;
  type: "success" | "error" | "info";
}> = ({ message, type }) => {
  const colors = {
    success: "#00A884",
    error: "#D9534F",
    info: "#007BFF",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 15,
        right: 15,
        background: colors[type],
        color: "#fff",
        padding: "14px 18px",
        borderRadius: 10,
        fontSize: 15,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const phone = localStorage.getItem("phone") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanOtp = otp.trim();

    // Vérifier le numéro
    if (!phone) {
      showToast(
        "Numéro de téléphone introuvable. Veuillez recommencer.",
        "error"
      );
      return;
    }

    // Vérifier le code
    if (!cleanOtp) {
      showToast(
        "Veuillez saisir le code de vérification.",
        "error"
      );
      return;
    }

    if (!/^[0-9]{6}$/.test(cleanOtp)) {
      showToast(
        "Le code doit contenir exactement 6 chiffres.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      // Appel uniquement de verfiy_OTP
      const response = await verfiy_OTP({
        phone: phone,
        otp_code: cleanOtp,
      });
      console.log("VERIFY OTP RESPONSE :", response);
      console.log("VERIFY OTP DATA :", response.data);
      console.log("VERIFY OTP STATUS :", response.status);
      if (response.status === 200) {
        showToast(
          response.data.message ||
            "Numéro de téléphone vérifié avec succès.",
          "success"
        );

        // Redirection après vérification
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      } else {
        showToast(
          response.data.message ||
            "Code OTP invalide ou expiré.",
          "error"
        );
      }
    } catch (error: any) {
      console.error("Erreur vérification OTP :", error);

      showToast(
        error?.response?.data?.message ||
          "Erreur serveur. Veuillez réessayer.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* LOGO */}
      <div style={styles.logoWrapper}>
        <img
          src="/logo-founa.png"
          alt="FOUNA Logo"
          style={styles.logo}
        />
      </div>

      {/* CARD */}
      <div style={styles.card}>

        <h2 style={styles.title}>
          Vérification du numéro
        </h2>

        <p style={styles.description}>
          Entrez le code de vérification envoyé
          à votre numéro de téléphone.
        </p>

        <p style={styles.expiration}>
          Le code est valable pendant{" "}
          <strong>5 minutes</strong>.
        </p>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleVerifyOtp}
          style={styles.form}
        >

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            maxLength={6}
            autoFocus
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

              setOtp(value);
            }}
            style={styles.otpInput}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Vérification..."
              : "Vérifier le code"}
          </button>

        </form>

        {/* RETOUR */}
        <p style={styles.backText}>
          Mauvais numéro ?{" "}
          <span
            onClick={() => navigate("/auth/sendotp")}
            style={styles.backLink}
          >
            Modifier le numéro
          </span>
        </p>

        {/* INFORMATION */}
        <p style={styles.info}>
          🔒 Ne partagez jamais votre code de
          vérification avec une autre personne.
        </p>

      </div>

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

    </div>
  );
};

const styles: {
  [key: string]: React.CSSProperties;
} = {

  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F5F5F5",
    padding: "20px",
    boxSizing: "border-box",
  },

  logoWrapper: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
  },

  logo: {
    width: 220,
    height: "auto",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    padding: "30px 22px",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  icon: {
    width: 60,
    height: 60,
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "rgba(0,164,166,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
  },

  title: {
    margin: "0 0 10px",
    color: "#2E2E2E",
    fontSize: 24,
    fontWeight: 700,
  },

  description: {
    color: "#777",
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: 10,
  },

  phone: {
    color: "#00A4A6",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  expiration: {
    color: "#888",
    fontSize: 13,
    marginBottom: 25,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  otpInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 10px",
    borderRadius: 9,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 8,
  },

  button: {
    padding: "13px 15px",
    background: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: 16,
    fontWeight: "bold",
    transition: "0.2s",
  },

  backText: {
    marginTop: 20,
    color: "#777",
    fontSize: 13,
  },

  backLink: {
    color: "#00A4A6",
    fontWeight: "bold",
    cursor: "pointer",
  },

  info: {
    marginTop: 20,
    color: "#999",
    fontSize: 11,
    lineHeight: 1.5,
  },
};

export default VerifyOtpPage;