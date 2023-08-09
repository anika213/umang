
import classes from './AdminInterface.css'
import Navbar_landing from '../component/Navbar_landing'
import Chart from '../component/BiddersChart'
import { saveAs } from 'file-saver';
import axios from 'axios';


function Admin()

{
  function handleDownloadClick() {
    console.log("in handle download click");
    axios.get("http://localhost:8000/allbids/biddinginfo")   //get response from backend for bidding info
      .then((response) => {
        const { data } = response;
        const [values, names, emails] = data;
        const numberOfPaintings = values.length;
        const paintingNumbers = Array.from({ length: numberOfPaintings }, (_, index) => index + 1);
        const columnNames = ["Painting Number", "Names of Bidders", "Bidder Emails", "Highest Bids"];
        const rows = paintingNumbers.map((paintingNumber, index) => [paintingNumber, names[index], emails[index], values[index]]);
        const csvData = [columnNames, ...rows];
        const csvContent = csvData.map(row => row.join(",")).join("\n"); // convert to csv format
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'biddingdata.csv');         // download file
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  
  
  
 

    return (

       
        <div>
            <Navbar_landing></Navbar_landing>
            <p class='heading'>Welcome Organiser!</p>

            <button className="buttondownload" onClick={handleDownloadClick} >
          Download Data
        </button>
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
          
          
           
            
        </div>
    

    )
  


    
}

export {Admin}; 
