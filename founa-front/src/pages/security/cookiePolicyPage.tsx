import React from "react";
import { Cookie, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="cookie-policy-page">
      <style>{`
        .cookie-policy-page {
          min-height: 100vh;
          background: #f7fafa;
          color: #172126;
          font-family: Arial, Helvetica, sans-serif;
        }

        .cookie-header {
          background: white;
          border-bottom: 1px solid #e5eeee;
        }

        .cookie-header-inner {
          width: min(1180px, calc(100% - 32px));
          margin: auto;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cookie-logo {
          height: 42px;
        }

        .cookie-back {
          border: 0;
          background: #eefafa;
          color: #007f81;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-weight: 600;
        }

        .cookie-hero {
          background: linear-gradient(135deg, #00a4a6, #00888a);
          color: white;
          padding: 60px 20px;
        }

        .cookie-hero-inner {
          width: min(1180px, 100%);
          margin: auto;
        }

        .cookie-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255,255,255,.16);
          margin-bottom: 20px;
        }

        .cookie-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(30px, 5vw, 48px);
        }

        .cookie-content {
          width: min(980px, calc(100% - 32px));
          margin: 40px auto 80px;
          background: white;
          border-radius: 20px;
          padding: clamp(24px, 5vw, 50px);
          box-shadow: 0 12px 40px rgba(0,70,72,.06);
        }

        .cookie-content h2 {
          color: #007f81;
          margin: 38px 0 14px;
          font-size: 23px;
        }

        .cookie-content h2:first-child {
          margin-top: 0;
        }

        .cookie-content p,
        .cookie-content li {
          color: #4b5a60;
          line-height: 1.8;
          font-size: 15px;
        }

        .cookie-content ul {
          padding-left: 22px;
        }

        .cookie-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .cookie-table th,
        .cookie-table td {
          padding: 14px;
          text-align: left;
          border-bottom: 1px solid #e7eeee;
          font-size: 14px;
        }

        .cookie-table th {
          background: #f1fbfb;
          color: #007f81;
        }

        .cookie-note {
          background: #f1fbfb;
          border-left: 4px solid #00a4a6;
          padding: 18px;
          border-radius: 10px;
        }

        @media (max-width: 700px) {
          .cookie-header-inner {
            min-height: 64px;
          }

          .cookie-logo {
            height: 36px;
          }

          .cookie-back span {
            display: none;
          }

          .cookie-hero {
            padding: 42px 16px;
          }

          .cookie-content {
            width: calc(100% - 20px);
            margin-top: 20px;
            padding: 22px 18px;
          }

          .cookie-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>

      <header className="cookie-header">
        <div className="cookie-header-inner">
          <img
            src="/logo-founa2.png"
            alt="FOUNA"
            className="cookie-logo"
          />

          <button
            className="cookie-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            <span>Retour</span>
          </button>
        </div>
      </header>

      <section className="cookie-hero">
        <div className="cookie-hero-inner">
          <div className="cookie-icon">
            <Cookie size={30} />
          </div>

          <h1>Politique de cookies</h1>

          <p>
            Dernière mise à jour : 25 septembre 2026
          </p>
        </div>
      </section>

      <main className="cookie-content">

        <h2>1. Qu'est-ce qu'un cookie ?</h2>

        <p>
          Un cookie est un petit fichier ou identifiant pouvant être enregistré
          sur l'appareil d'un utilisateur lorsqu'il consulte un service en
          ligne.
        </p>

        <h2>2. Pourquoi FOUNA utilise-t-il des cookies ?</h2>

        <p>
          FOUNA peut utiliser des cookies et technologies similaires afin de :
        </p>

        <ul>
          <li>faire fonctionner la plateforme ;</li>
          <li>sécuriser certaines fonctionnalités ;</li>
          <li>mémoriser certaines préférences ;</li>
          <li>mesurer l'utilisation du service lorsque cela est autorisé ;</li>
          <li>fournir certaines fonctionnalités supplémentaires.</li>
        </ul>

        <h2>3. Catégories</h2>

        <table className="cookie-table">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Utilisation</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Cookies nécessaires</td>
              <td>Fonctionnement et sécurité de FOUNA.</td>
            </tr>

            <tr>
              <td>Préférences</td>
              <td>Mémorisation de certains choix.</td>
            </tr>

            <tr>
              <td>Mesure</td>
              <td>Mesure de l'utilisation lorsque le consentement est requis et obtenu.</td>
            </tr>

            <tr>
              <td>Marketing</td>
              <td>Fonctionnalités marketing lorsqu'elles sont utilisées et autorisées.</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Cookies nécessaires</h2>

        <p>
          Certains éléments techniques peuvent être nécessaires au
          fonctionnement du service, notamment pour la sécurité, la session
          et l'authentification.
        </p>

        <h2>5. Cookies nécessitant un consentement</h2>

        <p>
          Lorsque FOUNA utilise des cookies ou technologies similaires
          nécessitant un consentement, ceux-ci ne doivent être activés
          qu'après l'obtention du consentement correspondant.
        </p>

        <h2>6. Gestion du consentement</h2>

        <p>
          Lorsqu'un consentement est requis, FOUNA peut proposer les choix
          suivants :
        </p>

        <div className="cookie-note">
          <p>
            <strong>Tout accepter</strong> — accepter les catégories
            proposées.
          </p>

          <p>
            <strong>Tout refuser</strong> — refuser les catégories non
            nécessaires.
          </p>

          <p>
            <strong>Personnaliser</strong> — choisir les catégories autorisées.
          </p>
        </div>

        <h2>7. Modification du consentement</h2>

        <p>
          L'utilisateur doit pouvoir modifier ses préférences ultérieurement
          au moyen du centre de préférences accessible depuis FOUNA.
        </p>

        <h2>8. Services tiers</h2>

        <p>
          Certains services intégrés à FOUNA peuvent utiliser leurs propres
          technologies. La liste des services réellement utilisés doit être
          maintenue à jour dans la présente politique.
        </p>

        <h2>9. Durée</h2>

        <p>
          Les technologies utilisées peuvent être temporaires ou persistantes.
          Leur durée dépend de leur fonction et de leur configuration.
        </p>

        <h2>10. Contact</h2>

        <p>
          Pour toute question concernant les cookies :
        </p>

        <p>
          founaci.communication@gmail.com
        </p>

      </main>
    </div>
  );
};

export default CookiePolicyPage;