import emailjs from '@emailjs/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactDOM from 'react-dom';
import ModalImage from "react-modal-image";
import classes from './Display.css';
import Navbar_landing from '../component/Navbar_landing.js'
import React, { useState, useEffect} from 'react'
import axios from 'axios';
import LoadingScreen from '../component/Loading';
import { CheckCookie } from './Landing';
// import { paintingsTitles } from './Highestbids';
import { checkIfBiddingDone } from './Login';
import ImageDisplay from '../component/ImageDisplay';
let rowcount = 1;
let y =0;
export var h1 = 70;
const MySwal = withReactContent(Swal)
var highestbid;
  

function Display()
{ 


async function bid(art_number){  
  if(isBiddingEnded === true){
    //alert the user that they cant log in because bidding is done
    MySwal.fire({
      title: <strong>Sorry, You bid on this painting, the Bidding has ended!</strong>,
      background: 'white',
      width: '35vmax',
      confirmButtonText: 'OK',
      buttonsStyling: false,
    });
    console.log("bidding ended")
    return;
  }


  var paintingnumber = "painting"+String(art_number);
  if(CheckCookie("name")==false){ 
      MySwal.fire({
        title: <strong>Please login and try again!</strong>,
        background: "white",
        width: "35vmax",
        confirmButtonText: 'OK',
        buttonsStyling: false,

      })
      return false;
  }


  let bidvalue = prompt('How much would you like to bid for this piece(in SGD)?');

  if (!Number.isInteger(+bidvalue) || +bidvalue <= 0) {
    MySwal.fire({
      title: '<strong>Please enter a positive integer as your bid!</strong>',
      background: "white",
      width: "35vmax",
      confirmButtonText: 'OK',
      buttonsStyling: false,
    });
    return false;
  } 
  
  bidvalue = parseInt(bidvalue);
  var name = CheckCookie("name");
  await axios.put('http://localhost:8000/allbids/placebid',{paintingnumber,name,bidvalue})
  .then(async (val)=>{
          console.log(val,"cookie sent");
          // console.log(val.data);
          if(val.data=="time"){
            MySwal.fire({
              title: <strong>Sorry, you can't bid within 10 seconds of another bid!</strong>,
              background: "white",
              width: "35vmax",
              confirmButtonText: 'OK',
              buttonsStyling: false,
            });
            
          }
          if(val.data=="value"){
            MySwal.fire({
              title: <strong>Sorry, this bid is not greater than the current value!</strong>,
              background: "white",
              width: "35vmax",
              confirmButtonText: 'OK',
              buttonsStyling: false,
            });
            
          }
          const prevemail = val.data[0].useremail
          const prevname = val.data[0].username
          if(prevemail!=CheckCookie("email")){
            console.log("sending email")
          var params ={
            name: prevname,
            email: prevemail,
            painting_title: paintingsTitles[paintingnumber],
          };
          if(prevemail!="minbid@gmail.com"){
            // emailjs.send("service_adnzlti","template_fh02zsq",params,"e7AJH9FfOWzIXQQJm");
          }
      }
      try {
        const response = await axios.get('http://localhost:8000/paintinginfo');
        if (response.data && response.data.highestBids) {
          setHighestBidsValues(response.data.highestBids);
        }
      } catch (error) {
        console.error("Error fetching updated highest bids:", error);
      }
   
  });
 
}

function alert(paintingnumber){

  MySwal.fire({
    title: <strong>{paintingsTitles[paintingnumber]}</strong>,
    html:
    <div>
        <span>DESCRIPTION:</span> 
        <br></br>
        <p1>{descriptions[paintingnumber]} </p1>
        <br></br>
        <br></br>
        <p1><span>MEDIUM:</span> {PaintingMediums[paintingnumber]} </p1>
        <br></br>
        <p1><span>THEME:</span> Discovery </p1>
        <br></br>
        <p1><span>SIZE:</span> Approx. A3</p1>
        </div>,
    background:"black",
    width: "50vmax",
    showConfirmButton: false

  })  

}
  let [paintingsTitles, setPaintingTitles] = useState({});
  let [Paintingsizes, setPaintingSizes] = useState({});
  let [descriptions, setPaintingDescriptions] = useState({});
  let [HighestBidsValues, setHighestBidsValues] = useState({});
  let [PaintingMediums, setPaintingMediums] = useState({});
  let [numberOfPaintings, setNumberOfPaintings] = useState();
  const [images, setImages] = useState({});
  const [isBiddingEnded, setIsBiddingEnded] = useState(false);

  useEffect(() => {
    const getBiddingInfo = async () => {
      if (await checkIfBiddingDone() === true) {
        setIsBiddingEnded(true);
      }
    };
    getBiddingInfo();
  }, []);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const requests = [];
  //       for (let i = 1; i <= numberOfPaintings; i++) {
  //         const paintingNumber = `painting${i}`;
  //         requests.push(
  //           axios.get(`http://localhost:8000/image`, {
  //             params: { paintingnumber: paintingNumber },
  //           })
  //         );
  //       }
  
  //       const responses = await Promise.all(requests);
  //       const imageUrls = {};
        
  //       responses.forEach((response, index) => {
  //         const paintingNumber = `painting${index + 1}`;
  //         imageUrls[paintingNumber] = `http://localhost:8000/image?paintingnumber=${paintingNumber}`;
  //       });
  
  //       setImages(imageUrls);
  //     } catch (error) {
  //       console.error("Error fetching images:", error);
  //     }
  //   };
  
  //   fetchImages();
  // }, [numberOfPaintings]);
  



  
    // Fetch the data when the component mounts
   // Fetch the data when the component mounts
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/paintinginfo');
      // Accessing the properties in the response
      const titles = response.data.titles;
      const sizes = response.data.sizes;
      const descriptions = response.data.descriptions;
      const highestBids = response.data.highestBids;
      const imageurls = response.data.images;
      const mediums = response.data.mediums;
      
      // Update the state variables
      setPaintingTitles(titles);
      setPaintingSizes(sizes);
      setPaintingDescriptions(descriptions);
      setHighestBidsValues(highestBids);
      setPaintingMediums(mediums);
      setImages(imageurls);


      // Set the number of paintings
      const numPaintings = Object.keys(titles).length;
      setNumberOfPaintings(numPaintings);
      console.log(numberOfPaintings)
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching data:", error);
    }
  };
  
  fetchData();
}, []);

        const [searchQuery, setSearchQuery] = useState('');
        const [filteredPaintings, setFilteredPaintings] = useState([]);
      
        const scrollToPainting = (paintingTitle) => {
          const paintingElement = document.getElementById(paintingTitle);
          if(paintingElement) {
            paintingElement.scrollIntoView({behavior: "smooth"});
          }
        }
      
        const handleSearch = (searchValue) => { // searchValue is what the user types in
          setSearchQuery(searchValue);
          const filtered = Object.values(paintingsTitles).filter(title => // filtering the titles which include what the user types in
            title.toLowerCase().includes(searchValue.toLowerCase())
          );
          setFilteredPaintings(filtered);
        }
        const paintingNumbers = Array.from({ length: 30 }, (_, i) => i + 1); // Changed from numberOfPaintings to 50
        console.log("image" + images);
        console.log(paintingsTitles);
        return (
          <div>
            <Navbar_landing></Navbar_landing>
            <h1>Art Gallery</h1>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'relative',left: '35px', zIndex: '1', color: 'gray' }} />
              <input
                type="text"
                id="searchInput"
                placeholder="Search for a painting..."
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
                style={{ paddingLeft: '40px' }} // Add padding to make space for the icon
              />
            </div>
            {searchQuery.length > 0 && (
              <ul id="suggestions">
                {filteredPaintings.map((title, index) => (
                  <li key={index} onClick={() => scrollToPainting(title)}>
                    {title}
                  </li>
                ))}
              </ul>
            )}
          <div id="root" style={{ padding: '5%', textAlign: 'center' }}>   
          <div className="gallery-container">
      {paintingNumbers.map((num) => {
        const paintingKey = `painting${num}`;
        if (!paintingsTitles[paintingKey]) {
          return null; // Skip this iteration if the painting doesn't exist in paintingsTitles
        }
        return (
          <ImageDisplay
            key={paintingKey}
            image={images[paintingKey]}
            title={paintingsTitles[paintingKey]}
            size={Paintingsizes[paintingKey]}
            bid={HighestBidsValues[paintingKey]}
            alert={() => alert(paintingKey)}
            placebid={() => bid(num)}
          />
        );
      })}
    </div>
            </div>
          </div>
        );
        

             
   
}
export  default Display;