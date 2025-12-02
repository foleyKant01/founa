import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
    const nav = useNavigate();

    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        // 👉 logique API plus tard
        nav("/auth/login");
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
                <h2 style={styles.title}>Créer un compte</h2>

                <form onSubmit={handleRegister} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Nom complet"
                        style={styles.input}
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />

                    <input
                        type="tel"
                        placeholder="Numéro de téléphone"
                        style={styles.input}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        pattern="[0-9]{8,15}" // optionnel : accepte 8 à 15 chiffres
                        title="Veuillez entrer un numéro de téléphone valide"
                    />

                    <input
                        type="text"
                        placeholder="Adresse de Livraison"
                        style={styles.input}
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        style={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5F5F5",
    },

    card: {
        width: 320,
        padding: "30px 20px",
        margin: "0px 10px 100px 10px",
        borderRadius: 15,
        background: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
    },

    /* 🔵 Nouveau block pour centrer et agrandir le logo */
    logoWrapper: {
        marginBottom: 20,
        display: "flex",
        justifyContent: "center",
    },

    logo: {
    width: 250,           // ← LOGO PLUS GRAND
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

export default RegisterPage;
