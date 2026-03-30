// src/pages/UpdateClient.tsx
import React, { useEffect, useState } from "react";
import { ReadSingleClient, UpdateClient as UpdateClientService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

interface User {
  fullname: string;
  email: string;
  phone: string;
  adresse_livraison: string;
  uid: string;
}

// 🔹 Toast Component
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
        background: colors[type],
        color: "#fff",
        padding: "14px 18px",
        fontSize: 17,
        textAlign: "center",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

const UpdateClient: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const client = JSON.parse(sessionStorage.getItem("user") || "{}");
  const uid = client.uid;

  useEffect(() => {
    if (uid) {
      ReadSingleClient({ uid })
        .then((res) => {
          if (res.data.status === "success") {
            setUser(res.data.client);
          }
        })
        .catch(() => showToast("Erreur chargement profil", "error"));
    }
  }, [uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!password) {
      showToast("Veuillez entrer votre mot de passe", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await UpdateClientService({
        uid: user.uid,
        password,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        adresse_livraison: user.adresse_livraison,
      });

      if (res.data.status === "success") {
        showToast("✅ Profil mis à jour avec succès", "success");
        setPassword(""); // reset champ

        setTimeout(() => {
          navigate("/profile");
        }, 2500);
      } else {
        showToast(res.data.message || "Erreur", "error");
      }
    } catch (err) {
      showToast("❌ Erreur serveur", "error");
    }

    setLoading(false);
  };

  if (!user) return <p style={{ padding: 20 }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Modifier mon profil</h2>

      <div style={styles.card}>
        <input
          style={styles.input}
          name="fullname"
          value={user.fullname}
          onChange={handleChange}
          placeholder="Nom complet"
        />

        <input
          style={styles.input}
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          style={styles.input}
          name="phone"
          value={user.phone}
          onChange={handleChange}
          placeholder="Téléphone"
        />

        <input
          style={styles.input}
          name="adresse_livraison"
          value={user.adresse_livraison}
          onChange={handleChange}
          placeholder="Adresse de livraison"
        />

        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez votre mot de passe pour confirmer"
        />

        <button style={styles.saveButton} onClick={handleSubmit} disabled={loading}>
          {loading ? "Mise à jour..." : "Enregistrer"}
        </button>

        <button style={styles.cancelButton} onClick={() => navigate("/profile")}>
          Annuler
        </button>
      </div>

      {/* 🔔 Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 10,
    minHeight: "80vh",
    backgroundColor: "#F5F5F5",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },
  saveButton: {
    padding: 12,
    backgroundColor: "#00A4A6",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10,
  },
  cancelButton: {
    padding: 12,
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
};

export default UpdateClient;