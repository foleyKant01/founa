import React from "react";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .legal-page {
          min-height: 100vh;
          background: #f7fafa;
          color: #172126;
          font-family: Arial, Helvetica, sans-serif;
        }

        .legal-header {
          background: #ffffff;
          border-bottom: 1px solid #e5eeee;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .legal-header-inner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .legal-logo {
          height: 42px;
          width: auto;
        }

        .legal-back {
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

        .legal-hero {
          background: linear-gradient(135deg, #00a4a6, #00888a);
          color: white;
          padding: 60px 20px;
        }

        .legal-hero-inner {
          width: min(1180px, 100%);
          margin: auto;
        }

        .legal-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255,255,255,.16);
          margin-bottom: 20px;
        }

        .legal-hero h1 {
          margin: 0 0 12px;
          font-size: clamp(30px, 5vw, 48px);
        }

        .legal-hero p {
          margin: 0;
          opacity: .9;
          font-size: 15px;
        }

        .legal-content {
          width: min(980px, calc(100% - 32px));
          margin: 40px auto 80px;
          background: #ffffff;
          border-radius: 20px;
          padding: clamp(24px, 5vw, 50px);
          box-shadow: 0 12px 40px rgba(0, 70, 72, .06);
        }

        .legal-content h2 {
          color: #007f81;
          margin: 38px 0 14px;
          font-size: 23px;
        }

        .legal-content h2:first-child {
          margin-top: 0;
        }

        .legal-content h3 {
          margin-top: 24px;
        }

        .legal-content p,
        .legal-content li {
          color: #4b5a60;
          line-height: 1.8;
          font-size: 15px;
        }

        .legal-content ul {
          padding-left: 22px;
        }

        .legal-box {
          background: #f1fbfb;
          border-left: 4px solid #00a4a6;
          padding: 18px;
          border-radius: 10px;
          margin: 20px 0;
        }

        .legal-contact {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #007f81;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .legal-header-inner {
            min-height: 64px;
          }

          .legal-logo {
            height: 36px;
          }

          .legal-back span {
            display: none;
          }

          .legal-hero {
            padding: 42px 16px;
          }

          .legal-content {
            width: calc(100% - 20px);
            margin-top: 20px;
            padding: 22px 18px;
            border-radius: 16px;
          }
        }
      `}</style>

      <header className="legal-header">
        <div className="legal-header-inner">
          <img
            src="/logo-founa2.png"
            alt="FOUNA"
            className="legal-logo"
          />

          <button
            className="legal-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            <span>Retour</span>
          </button>
        </div>
      </header>

      <section className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-icon">
            <ShieldCheck size={30} />
          </div>

          <h1>Politique de confidentialité</h1>

          <p>
            Dernière mise à jour : 25 septembre 2026
          </p>
        </div>
      </section>

      <main className="legal-content">

        <h2>1. Objet</h2>

        <p>
          La présente Politique de confidentialité explique comment FOUNA
          collecte, utilise, conserve et protège les données à caractère
          personnel des utilisateurs de sa plateforme.
        </p>

        <p>
          Elle s'applique notamment au site FOUNA accessible à l'adresse
          founa.ci ainsi qu'aux fonctionnalités proposées par la plateforme.
        </p>

        <h2>2. Responsable du traitement</h2>

        <div className="legal-box">
          <p>
            <strong>FOUNA</strong>
          </p>

          <p>
            Site : founa.ci
          </p>

          <p>
            E-mail : founaci.communication@gmail.com
          </p>

          <p>
            Téléphone : +2250702653594
          </p>

          <p>
            Adresse : Abidjan, Côte d'Ivoire
          </p>
        </div>

        <h2>3. Données susceptibles d'être collectées</h2>

        <p>
          Selon les fonctionnalités utilisées, FOUNA peut collecter les
          informations nécessaires au fonctionnement du service, notamment :
        </p>

        <ul>
          <li>nom et prénom ;</li>
          <li>adresse e-mail ;</li>
          <li>numéro de téléphone ;</li>
          <li>informations relatives au compte ;</li>
          <li>informations relatives aux commandes ;</li>
          <li>informations nécessaires à la livraison ;</li>
          <li>informations techniques relatives à l'appareil et au navigateur ;</li>
          <li>adresse IP et informations de sécurité ;</li>
          <li>identifiants nécessaires aux notifications push lorsque celles-ci sont autorisées.</li>
        </ul>

        <h2>4. Utilisation des données</h2>

        <p>
          Les données peuvent notamment être utilisées pour :
        </p>

        <ul>
          <li>créer et gérer un compte utilisateur ;</li>
          <li>permettre l'accès aux fonctionnalités de FOUNA ;</li>
          <li>traiter les commandes ;</li>
          <li>suivre l'évolution des commandes ;</li>
          <li>contacter l'utilisateur concernant son compte ou ses commandes ;</li>
          <li>envoyer des notifications liées au service ;</li>
          <li>sécuriser la plateforme ;</li>
          <li>prévenir les utilisations frauduleuses ;</li>
          <li>respecter les obligations légales applicables.</li>
        </ul>

        <h2>5. Notifications push</h2>

        <p>
          FOUNA peut utiliser Firebase Cloud Messaging afin d'envoyer des
          notifications aux utilisateurs qui ont autorisé les notifications.
        </p>

        <p>
          Ces notifications peuvent notamment concerner l'évolution d'une
          commande ou des informations importantes relatives au fonctionnement
          du service.
        </p>

        <p>
          L'utilisateur peut refuser ou désactiver les notifications depuis
          les paramètres de son appareil ou de son navigateur lorsque cette
          fonctionnalité est disponible.
        </p>

        <h2>6. Prestataires techniques</h2>

        <p>
          FOUNA peut utiliser des prestataires techniques nécessaires au
          fonctionnement de la plateforme, notamment pour l'hébergement,
          les communications électroniques, les notifications, le stockage
          technique et les services nécessaires aux transactions.
        </p>

        <p>
          Lorsqu'un prestataire traite des données pour le compte de FOUNA,
          le traitement doit être limité aux finalités nécessaires au service
          concerné.
        </p>

        <h2>7. Conservation</h2>

        <p>
          Les données sont conservées pendant une durée proportionnée aux
          finalités pour lesquelles elles ont été collectées et conformément
          aux obligations légales applicables.
        </p>

        <p>
          Certaines données peuvent être conservées plus longtemps lorsqu'elles
          sont nécessaires à la preuve d'une transaction, à la résolution d'un
          litige ou au respect d'une obligation légale.
        </p>

        <h2>8. Sécurité</h2>

        <p>
          FOUNA met en œuvre des mesures techniques et organisationnelles
          raisonnables destinées à protéger les données contre les accès
          non autorisés, la perte, la modification, la divulgation ou la
          destruction non autorisée.
        </p>

        <h2>9. Droits des utilisateurs</h2>

        <p>
          Dans les conditions prévues par la réglementation applicable,
          l'utilisateur peut notamment disposer de droits d'accès, de
          rectification, de mise à jour, d'opposition lorsque celle-ci est
          applicable, de retrait du consentement lorsque le traitement repose
          sur celui-ci et de suppression lorsque les conditions légales sont
          réunies.
        </p>

        <p>
          Pour exercer un droit, l'utilisateur peut contacter FOUNA :
        </p>

        <p className="legal-contact">
          <Mail size={18} />
          founaci.communication@gmail.com
        </p>

        <h2>10. Données des mineurs</h2>

        <p>
          Les services nécessitant une capacité juridique particulière ne
          doivent pas être utilisés par une personne qui ne dispose pas de
          cette capacité, sauf dans les conditions prévues par la loi.
        </p>

        <h2>11. Modifications</h2>

        <p>
          FOUNA peut modifier cette politique afin de tenir compte de
          l'évolution de ses services ou de la réglementation applicable.
        </p>

        <h2>12. Contact</h2>

        <p>
          Pour toute question concernant cette politique ou le traitement des
          données personnelles, contactez FOUNA à l'adresse :
        </p>

        <p className="legal-contact">
          <Mail size={18} />
          founaci.communication@gmail.com
        </p>

      </main>
    </div>
  );
};

export default PrivacyPolicyPage;