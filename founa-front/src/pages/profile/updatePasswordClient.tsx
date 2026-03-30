// src/pages/UpdatePassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdatePassword as UpdatePasswordService } from "../../services/auth.service";

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

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Veuillez remplir tous les champs", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Mot de passe trop court (min 6 caractères)", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await UpdatePasswordService({
        uid: uid,
        old_password: oldPassword,
        password: newPassword,
      });

      if (res.data.status === "success") {
        showToast("🔐 Mot de passe modifié avec succès", "success");

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Changer le mot de passe</h2>

      <div style={styles.card}>
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* 👁️ toggle */}
        <div style={styles.toggleWrapper}>
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          <span>Afficher les mots de passe</span>
        </div>

        <button style={styles.saveButton} onClick={handleSubmit} disabled={loading}>
          {loading ? "Modification..." : "Mettre à jour"}
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
    minHeight: "100vh",
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
  toggleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    fontSize: 13,
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

export default UpdatePassword;