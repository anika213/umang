import './MyBids.css'
import Navbar_landing from '../component/Navbar_landing'
import { CheckCookie } from './Landing';
import classes from './UploadImages.css'
import withReactContent from 'sweetalert2-react-content';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import ImageModal from '../component/ImageModal';
import { useNavigate } from 'react-router-dom';
import {admin} from './Login.js'
import { paintingsTitles } from './Highestbids';
import { set } from 'mongoose';

const MySwal = withReactContent(Swal);

 function UploadImages() {


  async function resetAuction() {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to reset the auction? This action is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

  
          const response = await axios.get('http://localhost:8000/resetauction');
          if (response.status === 200) {
            MySwal.fire(
              'Reset!',
              'The auction has been reset.',
              'success'
            );
          }
    
        } catch (error) {
          console.error("Error resetting the auction:", error);
          MySwal.fire(
            'Failed!',
            'The auction could not be reset.',
            'error'
          );
        }
      }
    });
  }
  
  async function saveInfo(title,artist,description,medium,minBid,styling){
    console.log(title,artist,description,medium,minBid,styling);
    console.log("PAINTING"+paintingnum)
    await axios.put('http://localhost:8000/admin/addpainting', {title,artist,description,medium,minBid,styling,image:uploadedImage,paintingnum })
    .then((data) => {
      console.log(data, 'userRegistered');
      setInitialModalData({}); // Reset the initial modal data
      // Add the alert here to notify the user that the painting has been successfully added
      MySwal.fire({
        title: 'Success!',
        text: 'Painting has been successfully updated.',
        icon: 'success',
        confirmButtonText: 'OK',
        buttonsStyling: false,
      });
      // navigate('/display', { replace: true });
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error);
    });
  
    setShowModal(false)
  }
  let [paintingsTitles, setPaintingTitles] = useState([]);
  let [paintingnum, setPaintingnum] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/paintinginfo');
        // Accessing the properties in the response
        const titles = response.data.titles;

        
        // Update the state variables
        setPaintingTitles(titles);

  
  
        // Set the number of paintings

      } catch (error) {
        // Handle any errors here
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);
  // Define state to hold the uploaded image and modal visibility
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [initialModalData, setInitialModalData] = useState({}); // New state

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setShowModal(true);  // Show the modal
      };
      reader.readAsDataURL(file);
    } else {
      MySwal.fire({
        title: 'Please enter an image file (jpg or png)',
        cancelButtonText: 'OK',
        buttonsStyling: false,
      })
    }
  };
function cancelPressed(){
  setShowModal(false)
}


async function handleRowClick(paintingNumber, paintingTitle) {
  MySwal.fire({
    title: 'What would you like to do?',
    text: `You've selected ${paintingTitle}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Edit',
    cancelButtonText: 'Delete',
    buttonsStyling: false,
  }).then((result) => {
    (async () => {  // Immediately invoked async function
      if (result.isConfirmed) {
        try {
          setPaintingnum(paintingNumber)
          const val = await axios.put('http://localhost:8000/admin/loadinfo', {"paintingnumber": paintingNumber});
          console.log(val.data.info)
          setInitialModalData(val.data.info); // Update the initial modal data
          setUploadedImage(`http://localhost:8000/image?paintingnumber=${paintingNumber}`);
          // Update the uploaded image
          setShowModal(true); // Show the modal
          console.log(`Editing ${paintingTitle}`);
        } catch (error) {
          console.log(error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        try {
          const val = await axios.put('http://localhost:8000/admin/deletepainting', {"paintingnumber": paintingNumber});
          if (val.status === 200) {
            MySwal.fire({
              title: 'Deleted!',
              text: 'The painting has been deleted.',
              icon: 'success',
              buttonsStyling: false
            });
            
          }
          console.log(`Deleting ${paintingTitle}`);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  });
}

  return (
    <div>
      <Navbar_landing />
    
      <h1>UPLOAD PAINTINGS</h1>
      <div>
        <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} placeholder='Add a Painting' />
        <ImageModal show={showModal} imageSrc={uploadedImage} onClose={saveInfo} cancelPressed={cancelPressed} initialData={initialModalData} />
      </div>
      <div>
      <p className='mini-title'>Current Paintings in the Database</p>
        {
          Object.keys(paintingsTitles).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Painting Number</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.keys(paintingsTitles).map((paintingNumber, index) => (
                    <tr 
                      key={index} 
                      onClick={() => handleRowClick(paintingNumber, paintingsTitles[paintingNumber])}
                    >
                      <td>{paintingNumber}</td>
                      <td>{paintingsTitles[paintingNumber]}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ) : (
            <p>No paintings currently in the Database</p>
          )
        }
      </div>
      <br></br>
        <br></br>
      <button className="buttonreset" onClick={resetAuction} >Reset Auction</button>
    </div>
  );
}

export { UploadImages };
