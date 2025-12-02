import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const nav = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (pwd !== confirmPwd) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // 👉 logique API plus tard
    nav("/auth/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* 🔵 LOGO */}
        <img
          src="/logo-founa.png"
          alt="FOuna Logo"
          style={styles.logo}
        />

        <h2 style={styles.title}>Créer un compte</h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Nom complet"
            style={styles.input}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

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

          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            style={styles.input}
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            required
          />

          <button type="submit" style={styles.button}>
            S'inscrire
          </button>
        </form>

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
    </div>
  );
};

/* 🎨 Styles FOuna */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F5F5F5",
  },

  card: {
    width: 380,
    padding: "40px 30px",
    borderRadius: 14,
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  logo: {
    width: 90,
    marginBottom: 20,
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
    fontSize: 15,
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
    fontSize: 14,
  },

  loginLink: {
    color: "#00A4A6",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default RegisterPage;
