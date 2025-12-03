import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../../services/auth.service"; // 🔹 Service

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
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
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

const ForgotPasswordPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast("Veuillez entrer votre adresse email.", "error");
      return;
    }

    try {
      const response = await ForgotPassword({ email });

      if (response.data.status === "success") {
        showToast("Un email de réinitialisation a été envoyé !", "success");
        setTimeout(() => nav("/auth/login"), 2000);
      } else {
        showToast(response.data.error_description || "Erreur lors de la réinitialisation", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erreur serveur. Veuillez réessayer.", "error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoWrapper}>
        <img src="/logo-founa.png" alt="FOUNA Logo" style={styles.logo} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Mot de passe oublié</h2>

        <form onSubmit={handleReset} style={styles.form}>
          <input
            type="email"
            placeholder="Adresse email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Réinitialiser le mot de passe
          </button>
        </form>

        <p style={styles.loginText}>
          Vous vous souvenez de votre mot de passe ?{" "}
          <span onClick={() => nav("/auth/login")} style={styles.loginLink}>
            Se connecter
          </span>
        </p>
      </div>

      {/* 🔔 Rendu du toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

/* 🎨 Styles identiques à RegisterPage pour uniformité */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F5F5F5",
  },
  card: {
    width: 320,
    padding: "40px 20px",
    margin: "0px 10px 170px 10px",
    borderRadius: 15,
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
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

export default ForgotPasswordPage;
