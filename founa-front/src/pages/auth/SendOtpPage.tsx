import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { send_OTP } from "../../services/auth.service";

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
        left: 0,
        right: 0,
        marginRight: 35,
        width: "100%",
        margin: "0",
        background: colors[type],
        color: "#fff",
        padding: "14px 18px",
        fontSize: 17,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

const SendOtpPage: React.FC = () => {
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
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
    }, 2500);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      showToast(
        "Veuillez saisir votre numéro de téléphone.",
        "error"
      );
      return;
    }

    if (!/^[0-9]{8,15}$/.test(phone)) {
      showToast(
        "Veuillez entrer un numéro de téléphone valide.",
        "error"
      );
      return;
    }

    try {
      const response = await send_OTP({
        phone: phone,
      });

      console.log("SEND OTP RESPONSE :", response);
      console.log("SEND OTP DATA :", response.data);

      /*
       * Même logique que LoginPage
       */
      if (response.data.status === "success") {

        showToast(
          response.data.message ||
            "Le code de vérification a été envoyé.",
          "success"
        );

        setTimeout(() => {
          nav("/auth/verifyotp", {
            state: {
              phone: phone,
            },
          });
        }, 1500);

      } else {

        showToast(
          response.data.message ||
            response.data.error_description ||
            "Impossible d'envoyer le code.",
          "error"
        );
      }

    } catch (error: any) {

      console.error("Erreur Send OTP :", error);

      showToast(
        error?.response?.data?.message ||
          "Erreur serveur. Veuillez réessayer.",
        "error"
      );
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

        <form
          onSubmit={handleSendOtp}
          style={styles.form}
        >

          <input
            type="tel"
            placeholder="Numéro de téléphone"
            style={styles.input}
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "")
              )
            }
            required
          />

          <button
            type="submit"
            style={styles.button}
          >
            Recevoir le code
          </button>

        </form>

        <p style={styles.info}>
          Un code de vérification vous sera envoyé
          par SMS sur ce numéro.
        </p>

        <p style={styles.loginText}>
          Vous avez déjà un compte ?{" "}
          <span
            onClick={() => nav("/auth/login")}
            style={styles.loginLink}
          >
            Se connecter
          </span>
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
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F5F5F5",
  },

  logoWrapper: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
  },

  logo: {
    width: 250,
    height: "auto",
  },

  card: {
    width: 320,
    padding: "40px 20px",
    margin: "0px 15px 150px 15px",
    borderRadius: 15,
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: 25,
    color: "#2E2E2E",
    fontSize: 26,
    fontWeight: 700,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  input: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    transition: "0.2s",
  },

  button: {
    marginTop: 10,
    padding: "12px 15px",
    background: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 17,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },

  info: {
    marginTop: 20,
    color: "#777",
    fontSize: 14,
    lineHeight: 1.5,
  },

  loginText: {
    marginTop: 20,
    color: "#555",
    fontSize: 16,
  },

  loginLink: {
    color: "#00A4A6",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default SendOtpPage;