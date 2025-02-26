import React from "react";
import "./GuideTourCard.css"; // Stil dosyası

const GuideTourCard = ({ guide, tour, status }) => {
  const currentDate = new Date();
  const tourDate = new Date(tour.date);

  let statusText = "";
  let statusClass = "";

  if (tourDate < currentDate) {
    statusText = "Tamamlanmış Tur";
    statusClass = "status-past";
  } else {
    statusText = "Beklenen Tur";
    statusClass = "status-upcoming";
  }

  return (
    <div className="guide-tour-card">
      <div className="guide-tour-left">
        <img
          src={guide.profile_picture_url  ||  "https://via.placeholder.com/100"}
          alt={guide.name}
          className="guide-tour-image"
        />
      </div>
      <div className="guide-tour-right">
        <h3
          style={{
            fontWeight: "bold",
          }}
        >
          {guide.name}
        </h3>
        <p>
          <strong>Tur:</strong> {tour.high_school_name} ({tour.city})
        </p>
        <p>
          <strong>Tarih:</strong> {new Date(tour.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Saat:</strong>{" "}
          {new Date(tour.date).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p>
          <strong>Durum:</strong>{" "}
          <span className={`status ${statusClass}`}>{statusText}</span>
        </p>
      </div>
    </div>
  );
};

export default GuideTourCard;
