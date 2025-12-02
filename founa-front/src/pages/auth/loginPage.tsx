import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && pwd) {
      nav("/home");
    }
  };

  return (
    <div style={styles.container}>

      {/* 🔵 LOGO GRAND ET CENTRÉ */}
      <div style={styles.logoWrapper}>
        <img
          src="/logo-founa.png"
          alt="FOUNA Logo"
          style={styles.logo}
        />
      </div>
      <div style={styles.card}>
        <h2 style={styles.title}>Connexion</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Adresse email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            style={styles.input}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            Se connecter
          </button>
        </form>

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
    </div>
  );
};

/* 🎨 Styles FOuna */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F5F5F5",
  },

  /* 🔵 Nouveau block pour centrer et agrandir le logo */
  logoWrapper: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
  },

  logo: {
    width: 150,           // ← LOGO PLUS GRAND
    height: "auto",
  },

  card: {
    width: 320,
    padding: "40px 30px",
    margin: "0px 20px",
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

  registerText: {
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },

  registerLink: {
    color: "#00A4A6",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default LoginPage;
