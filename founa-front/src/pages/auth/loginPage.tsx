import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginClient } from "../../services/auth.service";

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

const LoginPage: React.FC = () => {
  const nav = useNavigate();

  // Email OU numéro de téléphone
  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier || !password) {
      showToast(
        "Veuillez renseigner votre email ou numéro de téléphone et votre mot de passe.",
        "error"
      );
      return;
    }

    /*
     * Si l'identifiant contient "@", on considère
     * qu'il s'agit d'un email.
     *
     * Sinon, on considère qu'il s'agit d'un numéro
     * de téléphone.
     */
    const isEmail = cleanIdentifier.includes("@");

    const payload = {
      email: isEmail ? cleanIdentifier : "",
      phone: isEmail ? "" : cleanIdentifier,
      password,
    };

    try {
      const response = await LoginClient(payload);

      if (response.data.status === "success") {
        const user = response.data.user_infos;

        showToast("Connexion réussie !", "success");

        setTimeout(() => {
          if (user.role === "Client") {
            localStorage.setItem("user", JSON.stringify(user));
            nav("/home");

          } else if (user.role === "Teller") {
            localStorage.setItem("teller", JSON.stringify(user));
            nav("/teller/home");

          } else if (user.role === "Admin") {
            localStorage.setItem("admin", JSON.stringify(user));
            nav("/admin/home");

          } else if (user.role === "PartnerPub") {
            // Enregistrer le compte PartnerPub
            localStorage.setItem("partnerpub", JSON.stringify(user));

            // Redirection vers son espace
            nav("/partnerpub/home");

          } else {
            nav("/");
          }
        }, 1500);

      } else {
        showToast(
          response.data.message ||
            response.data.error_description ||
            "Erreur lors de la connexion.",
          "error"
        );
      }

    } catch (error) {
      console.error("Erreur connexion :", error);

      showToast(
        "Une erreur est survenue lors de la connexion.",
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
        <h2 style={styles.title}>Connexion</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          {/* EMAIL OU TELEPHONE */}
          <input
            type="text"
            placeholder="Email ou numéro de téléphone"
            style={styles.input}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />

          {/* MOT DE PASSE */}
          <input
            type="password"
            placeholder="Mot de passe"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {/* MOT DE PASSE OUBLIÉ */}
          <span
            style={styles.forgotPasswordLink}
            onClick={() => nav("/auth/forgotpassword")}
          >
            Mot de passe oublié ?
          </span>

          {/* BOUTON */}
          <button type="submit" style={styles.button}>
            Se connecter
          </button>
        </form>

        {/* INSCRIPTION */}
        <p style={styles.registerText}>
          Pas encore de compte ?{" "}
          <span
            onClick={() => nav("/auth/register")}
            style={styles.registerLink}
          >
            S'inscrire
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

/* 🎨 Styles FOUNA */
const styles: { [key: string]: React.CSSProperties } = {
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
    alignItems: "center",
  },

  logo: {
    width: 250,
    maxWidth: "80vw",
    height: "auto",
  },

  card: {
    width: 320,
    maxWidth: "calc(100vw - 30px)",
    padding: "40px 20px",
    margin: "0 15px 80px 15px",
    borderRadius: 15,
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  title: {
    margin: "0 0 25px 0",
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
    width: "100%",
    boxSizing: "border-box",
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

  forgotPasswordLink: {
    color: "#00A4A6",
    fontSize: 16,
    textAlign: "right",
    cursor: "pointer",
    marginTop: -5,
    marginBottom: 5,
    display: "block",
  },

  registerText: {
    marginTop: 20,
    color: "#555",
    fontSize: 16,
  },

  registerLink: {
    color: "#00A4A6",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default LoginPage;