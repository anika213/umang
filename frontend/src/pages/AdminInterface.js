
import classes from './AdminInterface.css'
import Navbar_landing from '../component/Navbar_landing'
// import Chart from '../component/BiddersChart'
import { saveAs } from 'file-saver';
import axios from 'axios';
import {admin} from './Login.js'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import withReactContent from 'sweetalert2-react-content';
import { paintingsTitles } from './Highestbids';
const MySwal = withReactContent(Swal);


async function viewPaintingHistory(paintingNumber) {
  try {
    const response = await axios.put('https://umang-react-usz25.ondigitalocean.app/admin/viewhistory', { "paintingnumber": paintingNumber });
    const bidHistory = response.data; // Assuming the response contains the bid history data

    const bidList = bidHistory.map((bid, index) => `${index + 1}. Bidder: ${bid.bidder}, Value: ${bid.bidvalue}`);

    MySwal.fire({
      title: `Bidding History`,
      html: `
        <p>Bid History:</p>
        ${bidList.map((bidItem) => `<div>${bidItem}</div>`).join('')}
      `,
      showCancelButton: false,
      confirmButtonText: 'OK',
      buttonsStyling: false,
    });
  } catch (error) {
    console.error("Error fetching bid history:", error);
  }
}

async function endBidding(){
  MySwal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to change the bidding state? This action will be irreversible.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    buttonsStyling: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.get('https://umang-react-usz25.ondigitalocean.app/admin/endbidding');
        if (response.status === 200) {
          MySwal.fire({
            title: 'Bidding State Changed!',
            icon: 'success',
            showCancelButton: false,
            buttonsStyling: false,
          })
        }
  
      } catch (error) {
        console.error("Error ending the bidding:", error);
        MySwal.fire(
          'Failed!',
          'The bidding could not be ended.',
          'error'
        );
      }
    }
  });

}

function Admin() {
  const navigate = useNavigate();
  console.log("ADMIN"+admin)
  let [paintingsTitles, setPaintingTitles] = useState([]);


  // else{


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://umang-react-usz25.ondigitalocean.app/paintinginfo');
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


  if (admin === false) {
    MySwal.fire({
      title: <strong>You are not authorized to see this page</strong>,
      background: 'white',
      width: '50vmin',
      confirmButtonText: 'OK',
      buttonsStyling: false,
    }).then(() => {
      navigate('/login', { replace: true }); // Redirect to "/display" when OK is clicked
    });

    return null; // Return null since the content should not be displayed
  }
    function handleDownloadClick() {
      console.log("in handle download click");
      axios.get("https://umang-react-usz25.ondigitalocean.app/allbids/biddinginfo")
        .then((response) => {
          const { data } = response;
          const [highestBidsData, highestBiddersNames, highestBiddersEmails, notes] = data;
          console.log(notes)
          
          const paintingNumbers = Object.keys(highestBiddersNames); // get painting numbers from keys
          const columnNames = ["Painting Title", "Names of Bidders", "Bidder Emails", "Highest Bids", "Notes for Artists"];
          const rows = paintingNumbers.map((paintingNumber) => [
            paintingsTitles[paintingNumber], // using titles from te titles dictionary
            highestBiddersNames[paintingNumber], 
            highestBiddersEmails[paintingNumber], 
            highestBidsData[paintingNumber],
            (notes[paintingNumber] && notes[paintingNumber].length > 0) ? notes[paintingNumber].join(", ") : ""
          ]);
          const csvData = [columnNames, ...rows];
          const csvContent = csvData.map(row => row.join(",")).join("\n");
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          saveAs(blob, 'biddingdata.csv');
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    

    
  function gotoUpload(){
      navigate('/upload', { replace: true }); // Redirect to "/display" when OK is clicked
  }

    return (

       
        <div>
            <Navbar_landing></Navbar_landing>
            <p class='heading'>Welcome Organiser!</p>

            <button className="buttondownload" onClick={handleDownloadClick} > Download Data </button>
            <br></br>

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
        {Object.keys(paintingsTitles).map((paintingNumber, index) => (
          <tr key={index} onClick={() => viewPaintingHistory(paintingNumber)}>
            <td>{paintingNumber}</td>
            <td>{paintingsTitles[paintingNumber]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No paintings currently in the Database</p>
  )
}

      </div>
      <br></br>
      <br></br>
      <p className='mini-title'>The Charts below are for you to visualise the current progress of the bidding</p>
      <br></br>
      <br></br>
       
<br></br>
        <br></br>
        <br></br>

        <button className="buttonmanage" onClick={gotoUpload} >Manage Paintings</button>
        <br></br>
        <br></br>
        <button className="buttonreset" onClick={endBidding}>Stop/Start Bidding</button>



        <br></br>
        <br></br>
            <br></br>
          
          
           
            
        </div>
    

    )
  
    }

    
// }

export {Admin}; 
