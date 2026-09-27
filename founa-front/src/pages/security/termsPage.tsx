import React from "react";
import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <style>{`
        .legal-page {
          min-height: 100vh;
          background: #f7fafa;
          color: #172126;
          font-family: Arial, Helvetica, sans-serif;
        }

        .legal-header {
          background: #fff;
          border-bottom: 1px solid #e5eeee;
        }

        .legal-header-inner {
          width: min(1180px, calc(100% - 32px));
          margin: auto;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .legal-logo {
          height: 42px;
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

        .legal-content {
          width: min(980px, calc(100% - 32px));
          margin: 40px auto 80px;
          background: white;
          border-radius: 20px;
          padding: clamp(24px, 5vw, 50px);
          box-shadow: 0 12px 40px rgba(0,70,72,.06);
        }

        .legal-content h2 {
          color: #007f81;
          margin: 38px 0 14px;
          font-size: 23px;
        }

        .legal-content h2:first-child {
          margin-top: 0;
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
            <FileText size={30} />
          </div>

          <h1>Conditions générales d'utilisation</h1>

          <p>
            Dernière mise à jour : 25 septembre 2026
          </p>
        </div>
      </section>

      <main className="legal-content">

        <h2>1. Objet</h2>

        <p>
          Les présentes Conditions générales d'utilisation définissent les
          règles applicables à l'utilisation de la plateforme FOUNA.
        </p>

        <h2>2. Acceptation</h2>

        <p>
          L'utilisation de FOUNA implique l'acceptation des présentes
          conditions lorsque celles-ci sont applicables à la fonctionnalité
          utilisée.
        </p>

        <h2>3. Compte utilisateur</h2>

        <p>
          Certaines fonctionnalités nécessitent la création d'un compte.
          L'utilisateur s'engage à fournir des informations exactes,
          complètes et à jour.
        </p>

        <p>
          L'utilisateur doit préserver la confidentialité de ses identifiants
          et signaler toute utilisation non autorisée de son compte.
        </p>

        <h2>4. Utilisation de la plateforme</h2>

        <p>
          L'utilisateur s'engage à utiliser FOUNA conformément aux lois et
          règlements applicables.
        </p>

        <p>Il est notamment interdit :</p>

        <ul>
          <li>d'utiliser FOUNA à des fins frauduleuses ;</li>
          <li>de fournir volontairement de fausses informations ;</li>
          <li>de tenter d'accéder au compte d'un autre utilisateur ;</li>
          <li>de perturber le fonctionnement de la plateforme ;</li>
          <li>d'introduire des logiciels malveillants ;</li>
          <li>d'utiliser le service pour une activité illicite.</li>
        </ul>

        <h2>5. Produits</h2>

        <p>
          FOUNA présente des produits provenant notamment de fournisseurs
          internationaux.
        </p>

        <p>
          Les informations disponibles peuvent comprendre le nom, la
          description, les images, les variantes, le prix, la disponibilité
          et certaines informations relatives au fournisseur.
        </p>

        <div className="legal-box">
          <p>
            Certaines informations relatives aux produits peuvent provenir
            directement des fournisseurs. FOUNA s'efforce de présenter les
            informations disponibles de manière exacte et actualisée.
          </p>
        </div>

        <h2>6. Commandes</h2>

        <p>
          L'utilisateur peut effectuer une commande selon le processus proposé
          par FOUNA.
        </p>

        <p>
          Une commande peut être soumise à confirmation lorsque cela est prévu
          par le fonctionnement du service.
        </p>

        <h2>7. Prix</h2>

        <p>
          Les prix affichés sur FOUNA correspondent aux informations disponibles
          au moment de l'affichage ou de la commande, sous réserve des
          conditions applicables.
        </p>

        <p>
          Les éventuels frais supplémentaires applicables à une commande
          doivent être communiqués à l'utilisateur avant la validation
          correspondante.
        </p>

        <h2>8. Paiement</h2>

        <p>
          Lorsque le paiement en ligne est proposé, celui-ci peut être réalisé
          au moyen des solutions de paiement disponibles sur FOUNA.
        </p>

        <p>
          Les paiements peuvent être traités par des prestataires externes
          spécialisés.
        </p>

        <h2>9. Livraison</h2>

        <p>
          Les modalités et délais de livraison sont communiqués selon les
          informations disponibles pour la commande concernée.
        </p>

        <p>
          Certains délais peuvent dépendre notamment du fournisseur, du
          transport, du dédouanement ou d'autres événements indépendants
          de FOUNA.
        </p>

        <h2>10. Notifications</h2>

        <p>
          FOUNA peut envoyer des notifications relatives aux commandes ou au
          fonctionnement du service lorsque l'utilisateur a autorisé les
          notifications.
        </p>

        <h2>11. Propriété intellectuelle</h2>

        <p>
          Le logo FOUNA, la marque, les interfaces, les textes, les éléments
          graphiques et les logiciels propres à FOUNA sont protégés par les
          règles applicables en matière de propriété intellectuelle.
        </p>

        <h2>12. Disponibilité</h2>

        <p>
          FOUNA met en œuvre des moyens raisonnables pour maintenir la
          plateforme accessible.
        </p>

        <p>
          Des interruptions peuvent néanmoins survenir en raison de
          maintenances, incidents techniques, problèmes réseau ou événements
          indépendants de FOUNA.
        </p>

        <h2>13. Suspension d'un compte</h2>

        <p>
          FOUNA peut suspendre ou fermer un compte en cas d'utilisation
          frauduleuse, de risque de sécurité, de violation des présentes
          conditions ou de comportement contraire à la réglementation
          applicable.
        </p>

        <h2>14. Données personnelles</h2>

        <p>
          Le traitement des données personnelles est décrit dans la
          <strong> Politique de confidentialité FOUNA</strong>.
        </p>

        <h2>15. Cookies</h2>

        <p>
          L'utilisation des cookies et technologies similaires est décrite
          dans la <strong>Politique de cookies FOUNA</strong>.
        </p>

        <h2>16. Modification des conditions</h2>

        <p>
          FOUNA peut modifier les présentes conditions lorsque cela est
          nécessaire afin de tenir compte de l'évolution du service ou de la
          réglementation.
        </p>

        <h2>17. Droit applicable</h2>

        <p>
          Les présentes conditions sont soumises au droit applicable en
          Côte d'Ivoire, sous réserve des règles impératives éventuellement
          applicables.
        </p>

        <h2>18. Contact</h2>

        <p>
          FOUNA<br />
          E-mail : founaci.communication@gmail.com<br />
          Téléphone : +2250702653594<br />
          Adresse : Abidjan, Côte d'Ivoire
        </p>

      </main>
    </div>
  );
};

export default TermsPage;