import React from 'react';
import './Popup.css';

const Popup = ({ imageUrl, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <img src={imageUrl} alt="Painting" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
