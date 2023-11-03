import React from 'react';
import classes from './ImageModal.css';
import ImageonUpload from './ImageonUpload';
import {useState,useEffect} from 'react';

const ImageModal = ({ show, imageSrc, onClose, cancelPressed, initialData}) => {
  console.log("IN IMAGEMODAL", show)
 // Split the initialData.title by " by " to get the title and artist
 const [title, setTitle] = useState('');
 const [artist, setArtist] = useState('');
 const [description, setDescription] = useState('');
 const [medium, setMedium] = useState('');
 const [minBid, setMinBid] = useState('');
 const [size, setSize] = useState('');
 const [theme, setTheme] = useState('');
 const [styling, setStyling] = useState('horizontalupload');

 useEffect(() => {
   // Update the state variables whenever initialData changes
   const [initialTitle, initialArtist] = (initialData.title || '').split(' by ');
   setTitle(initialTitle || '');
   setArtist(initialArtist || '');
   setDescription(initialData.description || '');
   setMedium(initialData.medium || '');
   setSize(initialData.size|| '');
   setTheme(initialData.theme || '');
   setMinBid(initialData.highestBid ? initialData.highestBid.bidvalue : '');
   setStyling(initialData.styling || 'horizontalupload');
 }, [initialData]);
console.log(title,artist,description,medium,minBid,styling)

  if (!show) {
    return null;
  }
  function closeModal() {
    onClose(title,artist,description,medium,minBid,styling);
    setTitle(''); // Reset the form fields
     setArtist('');
     setDescription('');
    setMedium('');
    setMinBid('');
    setTheme('');
    setSize('');
    setStyling('horizontalupload');

  }


  function changeStyling(){
    console.log("changing styling");
    if(styling=="horizontalupload"){
        setStyling("verticalupload");
    }
    else{
      setStyling("horizontalupload");
    }
}
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-left">
          <ImageonUpload imageSrc={imageSrc} styling={styling}/>
          <button className='style-button' onClick={changeStyling}>Vertical </button>
        <button className='style-button'onClick={changeStyling}>Horizontal </button>
        </div>
        <div className="modal-right">
          <div className="field-container">
            <p className="field-label">Title:</p>
            <input type="text" className="field-input" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Artist:</p>
            <input type="text" className="field-input" value={artist} onChange={(e) => setArtist(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Description:</p>
            <input type="text" className="field-input"value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Medium:</p>
            <input type="text" className="field-input" value={medium} onChange={(e) => setMedium(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Size:</p>
            <input type="text" className="field-input" value={size} onChange={(e) => setSize(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Theme:</p>
            <input type="text" className="field-input" value={theme} onChange={(e) => setTheme(e.target.value)}/>
          </div>
          <div className="field-container">
            <p className="field-label">Minimum Bid:</p>
            <input type="number" className="field-input" value={minBid} onChange={(e) => setMinBid(e.target.value)}/>
          </div>
          <button className='done-button' onClick={closeModal}> Done</button>
          <button className='done-button' onClick={cancelPressed}> Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
