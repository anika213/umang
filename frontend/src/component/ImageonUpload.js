import React from 'react';
import './ImageModal.css';  // Make sure to import the CSS

const ImageonUpload = ({ imageSrc,styling }) => {

  return (
    <div>
      <div>
        <p className='imagetext'>Image Preview</p>
        <img src={imageSrc} alt="Uploaded Preview" className={styling} />
        <br></br>

      </div>
    </div>
  );
};

export default ImageonUpload;
