import React from "react";
import "./skeleton.css"; // Asegúrate de incluir los estilos para los placeholders

const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text skeleton-title"></div>
      <div className="skeleton-text skeleton-description"></div>
      <div className="skeleton-text skeleton-price"></div>
      <div className="skeleton-text skeleton-stock"></div>
      <div className="skeleton-button"></div>
    </div>
  );
};

export default SkeletonCard;
