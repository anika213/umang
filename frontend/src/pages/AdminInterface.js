
import classes from './AdminInterface.css'
import Navbar_landing from '../component/Navbar_landing'
import Chart from '../component/BiddersChart'
import { saveAs } from 'file-saver';
import axios from 'axios';
import {admin} from './Login.js'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { paintingsTitles } from './Highestbids';
const MySwal = withReactContent(Swal);

function Admin() {
  const navigate = useNavigate();
  console.log("ADMIN"+admin)
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

  else{

    function handleDownloadClick() {
      console.log("in handle download click");
      axios.get("http://localhost:8000/allbids/biddinginfo")
        .then((response) => {
          const { data } = response;
          const [highestBidsData, highestBiddersNames, highestBiddersEmails, notes] = data;
          console.log(notes)
          
          const paintingNumbers = Object.keys(highestBiddersNames); // get painting numbers from keys
          const columnNames = ["Painting Title", "Names of Bidders", "Bidder Emails", "Highest Bids", "Notes for Artists"];
          const rows = paintingNumbers.map((paintingNumber) => [
            paintingsTitles[paintingNumber], // using titles from the titles dictionary
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
    
    
  

    return (

       
        <div>
            <Navbar_landing></Navbar_landing>
            <p class='heading'>Welcome Organiser!</p>

            <button className="buttondownload" onClick={handleDownloadClick} > Download Data </button>

            <p>The Charts below are for you to visualise the current progress of the bidding</p>
            <br></br>
        <div class='parent'>
          <Chart CSStype = "chart1" height={'400px'} width={'600px'} chartId={'63b57798-b99d-4d32-8b81-82b42cc44254'} chartURL={'https://charts.mongodb.com/charts-project-0-mqzzv'} />
          <Chart CSStype = "chart2" height={'400px'} width={'600px'} chartId={'63b629c0-e76a-4b83-8a50-1144282f8f33'} chartURL={'https://charts.mongodb.com/charts-project-0-mqzzv'} />
        </div>
<br></br>
        <div class='parent2'>
          <Chart CSStype = "chart1" height={'400px'} width={'600px'} chartId={'63b7dc7e-2404-4591-82d5-c77500033064'} chartURL={'https://charts.mongodb.com/charts-project-0-mqzzv'} />
          <Chart CSStype = "chart2" height={'400px'} width={'600px'} chartId={'63b626f1-b222-4caf-86bf-6652df41849f'} chartURL={'https://charts.mongodb.com/charts-project-0-mqzzv'} />
        </div>
        <br></br>
        <br></br>
        {/* <button className="buttonreset" >Reset auction</button> */}

        <br></br>
        <br></br>
            <br></br>
          
          
           
            
        </div>
    

    )
  
    }

    
}

export {Admin}; 
