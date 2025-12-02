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
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // 🔗 Ici tu feras ton appel API d'inscription
    console.log("Register:", { nom, email, pwd });

    // Redirection après inscription
    nav("/auth/login");
  };

  return (
    <div style={styles.container}>
      <h2>Créer un compte</h2>

      <form onSubmit={handleRegister} style={styles.form}>

        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          S’inscrire
        </button>
      </form>

      <p
        style={styles.link}
        onClick={() => nav("/auth/login")}
      >
        Déjà un compte ? Se connecter
      </p>
    </div>
  );
};

// 🎨 Styles simples
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 30,
    maxWidth: 400,
    margin: "0 auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 20,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 12,
    fontSize: 17,
    background: "#0066CC",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  link: {
    marginTop: 15,
    color: "#0066CC",
    cursor: "pointer",
  },
};

export default RegisterPage;
