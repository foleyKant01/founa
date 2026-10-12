import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateClient } from "../../services/auth.service";

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

const RegisterPage: React.FC = () => {
    const nav = useNavigate();

    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [codePromo, setCodePromo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast(
                "Les mots de passe ne correspondent pas.",
                "error"
            );
            return;
        }
        const payload = {
            fullname,
            phone,
            adresse_livraison: adresse,
            code_promo: codePromo.trim(),
            password,
            confirmpassword: confirmPassword,
        };
        try {
            const response = await CreateClient(payload);

            if (response.data.status === "success") {
                showToast(
                    "Votre compte a été créé avec succès !",
                    "success"
                );

                setTimeout(() => {
                    nav("/auth/login");
                }, 2000);
            } else {
                showToast(
                    response.data.error_description ||
                        "Impossible de créer votre compte.",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);

            showToast(
                "Erreur lors de l'inscription.",
                "error"
            );
        }
    };

    return (
        <div style={styles.container}>
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
                        pattern="[0-9]{8,15}"
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
                    <small style={{
                        display: "block",
                        textAlign: "left",
                        fontSize: "12px",
                        color: "#777",
                        marginTop: "-10px",
                        marginLeft: "4px"
                    }}>
                        Exemple : Abidjan, Yopougon, Kouté
                    </small>

                    {/* Code promo facultatif */}
                    <div style={styles.promoWrapper}>
                        <input
                            type="text"
                            placeholder="Code promo (facultatif)"
                            style={styles.input}
                            value={codePromo}
                            onChange={(e) =>
                                setCodePromo(e.target.value.toUpperCase())
                            }
                        />

                        <span style={styles.promoHint}>
                            Vous avez un code promo ? Entrez-le ici.
                        </span>
                    </div>

                    

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
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5F5F5",
        padding: "30px 15px",
        boxSizing: "border-box",
    },

    card: {
        width: 320,
        padding: "30px 20px",
        margin: "0 10px",
        borderRadius: 15,
        background: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
    },

    logoWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
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
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 15px",
        borderRadius: 8,
        border: "1px solid #ccc",
        fontSize: 16,
        outline: "none",
        transition: "0.2s",
    },

    promoWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        textAlign: "left",
    },

    promoHint: {
        fontSize: 12,
        color: "#777",
        paddingLeft: 4,
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