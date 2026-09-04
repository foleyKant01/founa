// src/pages/activity/ActivityPage.tsx
import React, { useMemo, useState } from "react";
import {
  Heart,
  History,
  Package,
  Clock3,
  ArrowRight,
  Trash2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/layout/bottomBar";
import { useActivity } from "../../context/activityContext";

type TabType = "favorites" | "history";

const ActivityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("favorites");

  const { favorites, history } = useActivity();
  const navigate = useNavigate();

  /*
   * On récupère uniquement les éléments utiles.
   * Le tri permet d'avoir les activités les plus récentes en premier.
   */
  const sortedHistory = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  const handleProductClick = (uid: string) => {
    navigate(`/singleproduct/${uid}`);
  };

  return (
    <div className="activity-page">

      {/* ================= HEADER ================= */}
      <header className="activity-header">
        <div>
          <div className="activity-eyebrow">
            <Sparkles size={15} />
            Votre espace personnel
          </div>

          <h1>Activités</h1>

          <p>
            Retrouvez vos produits favoris et vos dernières activités.
          </p>
        </div>

        <div className="activity-summary">
          <div className="summary-item">
            <Heart size={18} />
            <div>
              <strong>{favorites.length}</strong>
              <span>Favoris</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-item">
            <History size={18} />
            <div>
              <strong>{history.length}</strong>
              <span>Activités</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= TABS ================= */}
      <section className="activity-tabs-wrapper">
        <div className="activity-tabs">

          <button
            className={`activity-tab ${
              activeTab === "favorites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            <span className="tab-icon">
              <Heart size={19} />
            </span>

            <span className="tab-content">
              <strong>Favoris</strong>
              <small>
                {favorites.length}{" "}
                {favorites.length > 1 ? "produits" : "produit"}
              </small>
            </span>
          </button>

          <button
            className={`activity-tab ${
              activeTab === "history" ? "active" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            <span className="tab-icon">
              <History size={19} />
            </span>

            <span className="tab-content">
              <strong>Historique</strong>
              <small>
                {history.length}{" "}
                {history.length > 1 ? "activités" : "activité"}
              </small>
            </span>
          </button>

        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="activity-content">

        {activeTab === "favorites" ? (
          <>
            {favorites.length === 0 ? (
              <EmptyState
                type="favorites"
                onAction={() => navigate("/home")}
              />
            ) : (
              <section>

                <div className="section-heading">
                  <div>
                    <span className="section-label">COLLECTION</span>
                    <h2>Vos produits favoris</h2>
                  </div>

                  <span className="section-count">
                    {favorites.length}
                  </span>
                </div>

                <div className="favorites-grid">
                  {favorites.map((item) => (
                    <article
                      key={item.uid}
                      className="favorite-card"
                      onClick={() => handleProductClick(item.uid)}
                    >
                      {/* Image */}
                      <div className="favorite-image-wrapper">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.nom}
                            className="favorite-image"
                          />
                        ) : (
                          <div className="favorite-no-image">
                            <Package size={35} />
                          </div>
                        )}

                        <div className="favorite-badge">
                          <Heart
                            size={15}
                            fill="currentColor"
                          />
                        </div>

                        <button
                          className="favorite-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          aria-label="Supprimer des favoris"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Information */}
                      <div className="favorite-info">

                        <div className="favorite-type">
                          PRODUIT
                        </div>

                        <h3 title={item.nom}>
                          {item.nom}
                        </h3>

                        <div className="favorite-footer">
                          <span>
                            Voir le produit
                          </span>

                          <span className="favorite-arrow">
                            <ArrowRight size={17} />
                          </span>
                        </div>

                      </div>
                    </article>
                  ))}
                </div>

              </section>
            )}

          </>
        ) : (
          <>
            {sortedHistory.length === 0 ? (
              <EmptyState
                type="history"
                onAction={() => navigate("/home")}
              />
            ) : (
              <section>

                <div className="section-heading">
                  <div>
                    <span className="section-label">ACTIVITÉ</span>
                    <h2>Votre historique</h2>
                  </div>

                  <span className="section-count">
                    {sortedHistory.length}
                  </span>
                </div>

                <div className="history-container">

                  {sortedHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className="history-row"
                    >

                      {/* Timeline */}
                      <div className="timeline">

                        <div className="timeline-icon">
                          <Clock3 size={17} />
                        </div>

                        {index !== sortedHistory.length - 1 && (
                          <div className="timeline-line" />
                        )}

                      </div>

                      {/* Content */}
                      <div className="history-content">

                        <div className="history-main">
                          <h3>{item.title}</h3>

                          <span className="history-date">
                            {item.date}
                          </span>
                        </div>

                        <div className="history-bottom">
                          <span className="history-label">
                            Activité récente
                          </span>

                          <ArrowRight size={16} />
                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </section>
            )}
          </>
        )}

      </main>

      {/* ================= BOTTOM BAR ================= */}
      <BottomBar />

      {/* ================= CSS ================= */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        .activity-page {
          min-height: 100vh;
          width: 100%;
          background: #F5F7F8;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
          padding-bottom: 110px;
        }

        /* ================= HEADER ================= */

        .activity-header {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #E7EAED;
          padding: 34px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .activity-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #00A4A6;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 9px;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .activity-header h1 {
          margin: 0;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 800;
          color: #111827;
          letter-spacing: -1px;
        }

        .activity-header p {
          margin: 9px 0 0;
          color: #6B7280;
          font-size: 15px;
        }

        /* ================= SUMMARY ================= */

        .activity-summary {
          display: flex;
          align-items: center;
          background: #F8FAFA;
          border: 1px solid #E5EAEA;
          border-radius: 16px;
          padding: 15px 20px;
          min-width: 250px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #00A4A6;
        }

        .summary-item div {
          display: flex;
          flex-direction: column;
        }

        .summary-item strong {
          color: #111827;
          font-size: 20px;
          line-height: 1;
        }

        .summary-item span {
          color: #6B7280;
          font-size: 12px;
          margin-top: 4px;
        }

        .summary-divider {
          width: 1px;
          height: 38px;
          background: #DDE3E5;
          margin: 0 20px;
        }

        /* ================= TABS ================= */

        .activity-tabs-wrapper {
          width: 100%;
          padding: 25px 5% 0;
        }

        .activity-tabs {
          background: #E9EEEE;
          border-radius: 15px;
          padding: 5px;
          display: flex;
          max-width: 560px;
        }

        .activity-tab {
          flex: 1;
          border: none;
          background: transparent;
          border-radius: 11px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #667085;
          transition: all .2s ease;
          text-align: left;
        }

        .activity-tab:hover {
          color: #00A4A6;
        }

        .activity-tab.active {
          background: #ffffff;
          color: #00A4A6;
          box-shadow: 0 3px 12px rgba(0,0,0,.07);
        }

        .tab-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F1F5F5;
        }

        .activity-tab.active .tab-icon {
          background: #E4F7F7;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
        }

        .tab-content strong {
          font-size: 14px;
        }

        .tab-content small {
          font-size: 11px;
          color: #98A2B3;
          margin-top: 2px;
        }

        /* ================= CONTENT ================= */

        .activity-content {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 30px 5%;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .section-label {
          color: #00A4A6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .section-heading h2 {
          margin: 5px 0 0;
          font-size: 23px;
          color: #111827;
        }

        .section-count {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #E4F7F7;
          color: #00A4A6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        /* ================= FAVORITES ================= */

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .favorite-card {
          background: #ffffff;
          border: 1px solid #E7EAED;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            border-color .2s ease;
        }

        .favorite-card:hover {
          transform: translateY(-4px);
          border-color: #CBE8E8;
          box-shadow: 0 12px 30px rgba(0,0,0,.08);
        }

        .favorite-image-wrapper {
          height: 250px;
          background: #F4F6F6;
          position: relative;
          overflow: hidden;
        }

        .favorite-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .35s ease;
        }

        .favorite-card:hover .favorite-image {
          transform: scale(1.04);
        }

        .favorite-no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #AAB5B7;
        }

        .favorite-badge {
          position: absolute;
          top: 13px;
          left: 13px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          color: #E5484D;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,.1);
        }

        .favorite-delete {
          position: absolute;
          top: 13px;
          right: 13px;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,.95);
          color: #667085;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
        }

        .favorite-delete:hover {
          background: #FFF0F0;
          color: #E5484D;
        }

        .favorite-info {
          padding: 17px;
        }

        .favorite-type {
          color: #00A4A6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .8px;
          margin-bottom: 6px;
        }

        .favorite-info h3 {
          margin: 0;
          color: #172033;
          font-size: 16px;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .favorite-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 13px;
          border-top: 1px solid #EEF1F2;
          color: #667085;
          font-size: 12px;
        }

        .favorite-arrow {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F0F9F9;
          color: #00A4A6;
          transition: all .2s ease;
        }

        .favorite-card:hover .favorite-arrow {
          background: #00A4A6;
          color: white;
        }

        /* ================= HISTORY ================= */

        .history-container {
          background: #ffffff;
          border: 1px solid #E7EAED;
          border-radius: 18px;
          padding: 8px 22px;
        }

        .history-row {
          display: flex;
          min-height: 100px;
        }

        .timeline {
          width: 48px;
          position: relative;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .timeline-icon {
          width: 36px;
          height: 36px;
          margin-top: 22px;
          border-radius: 11px;
          background: #E4F7F7;
          color: #00A4A6;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .timeline-line {
          position: absolute;
          top: 58px;
          bottom: 0;
          width: 2px;
          background: #E4E9EA;
        }

        .history-content {
          flex: 1;
          padding: 21px 0;
          border-bottom: 1px solid #EEF1F2;
          cursor: pointer;
        }

        .history-row:last-child .history-content {
          border-bottom: none;
        }

        .history-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .history-main h3 {
          margin: 0;
          font-size: 15px;
          color: #172033;
          font-weight: 700;
        }

        .history-date {
          font-size: 12px;
          color: #98A2B3;
          white-space: nowrap;
        }

        .history-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 9px;
          color: #98A2B3;
        }

        .history-label {
          font-size: 11px;
        }

        .history-bottom svg {
          color: #00A4A6;
        }

        /* ================= EMPTY ================= */

        .empty-state {
          min-height: 430px;
          background: #ffffff;
          border: 1px solid #E7EAED;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .empty-inner {
          max-width: 430px;
        }

        .empty-icon {
          width: 76px;
          height: 76px;
          border-radius: 22px;
          background: #EAF7F7;
          color: #00A4A6;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 20px;
        }

        .empty-inner h2 {
          margin: 0;
          color: #172033;
          font-size: 23px;
        }

        .empty-inner p {
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
          margin: 10px 0 22px;
        }

        .empty-button {
          border: none;
          background: #00A4A6;
          color: #ffffff;
          padding: 12px 22px;
          border-radius: 11px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all .2s ease;
        }

        .empty-button:hover {
          background: #008B8D;
          transform: translateY(-1px);
        }

        /* ================= TABLET ================= */

        @media (max-width: 1200px) {

          .favorites-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .favorite-image-wrapper {
            height: 220px;
          }

        }

        @media (max-width: 900px) {

          .activity-header {
            padding: 28px 4%;
          }

          .activity-tabs-wrapper {
            padding-left: 4%;
            padding-right: 4%;
          }

          .activity-content {
            padding-left: 4%;
            padding-right: 4%;
          }

          .activity-summary {
            min-width: auto;
          }

          .favorites-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

        }

        /* ================= MOBILE ================= */

        @media (max-width: 650px) {

          .activity-page {
            padding-bottom: 100px;
          }

          .activity-header {
            padding: 24px 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .activity-header h1 {
            font-size: 29px;
          }

          .activity-header p {
            font-size: 13px;
            line-height: 1.5;
          }

          .activity-summary {
            width: 100%;
            justify-content: center;
          }

          .summary-divider {
            margin: 0 25px;
          }

          .activity-tabs-wrapper {
            padding: 18px 15px 0;
          }

          .activity-tabs {
            width: 100%;
          }

          .activity-tab {
            padding: 10px;
          }

          .tab-icon {
            width: 32px;
            height: 32px;
          }

          .activity-content {
            padding: 25px 15px;
          }

          .section-heading {
            margin-bottom: 15px;
          }

          .section-heading h2 {
            font-size: 19px;
          }

          .favorites-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 11px;
          }

          .favorite-image-wrapper {
            height: 170px;
          }

          .favorite-info {
            padding: 12px;
          }

          .favorite-info h3 {
            font-size: 13px;
          }

          .favorite-footer {
            margin-top: 11px;
          }

          .favorite-footer span:first-child {
            font-size: 10px;
          }

          .favorite-arrow {
            width: 27px;
            height: 27px;
          }

          .favorite-delete,
          .favorite-badge {
            width: 30px;
            height: 30px;
          }

          .history-container {
            padding: 4px 14px;
            border-radius: 15px;
          }

          .timeline {
            width: 40px;
          }

          .timeline-icon {
            width: 31px;
            height: 31px;
          }

          .timeline-line {
            top: 53px;
          }

          .history-content {
            padding: 18px 0;
          }

          .history-main {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .history-main h3 {
            font-size: 13px;
            line-height: 1.4;
          }

          .history-date {
            font-size: 10px;
          }

          .empty-state {
            min-height: 400px;
            padding: 25px;
          }

        }

        @media (max-width: 400px) {

          .favorites-grid {
            grid-template-columns: 1fr 1fr;
          }

          .favorite-image-wrapper {
            height: 145px;
          }

          .activity-tab {
            gap: 6px;
          }

          .tab-content strong {
            font-size: 12px;
          }

          .tab-content small {
            font-size: 9px;
          }

        }

      `}</style>
    </div>
  );
};

/* =====================================================
   EMPTY STATE
===================================================== */

interface EmptyStateProps {
  type: "favorites" | "history";
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
}) => {
  const isFavorites = type === "favorites";

  return (
    <div className="empty-state">
      <div className="empty-inner">

        <div className="empty-icon">
          {isFavorites ? (
            <Heart size={34} />
          ) : (
            <History size={34} />
          )}
        </div>

        <h2>
          {isFavorites
            ? "Votre liste est vide"
            : "Aucune activité récente"}
        </h2>

        <p>
          {isFavorites
            ? "Ajoutez les produits qui vous intéressent à vos favoris pour les retrouver facilement ici."
            : "Votre historique d'activités apparaîtra ici lorsque vous interagirez avec les produits."}
        </p>

        <button
          className="empty-button"
          onClick={onAction}
        >
          <ShoppingBag size={17} />
          Découvrir les produits
        </button>

      </div>
    </div>
  );
};

export default ActivityPage;