import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Ici tu feras ton appel API Login
    if (email && pwd) {
      nav("/home"); // redirection après connexion
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Connexion</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />

        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        /><br />

        <button type="submit">Se connecter</button>
      </form>

      <p onClick={() => nav("/auth/register")} style={{ color: "blue", cursor: "pointer" }}>
        Créer un compte
      </p>
    </div>
  );
};

export default LoginPage;
