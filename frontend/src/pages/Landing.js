
import classes from './Landing.css'
import { BrowserRouter, Route, useNavigate } from "react-router-dom";
import Navbar_landing from '../component/Navbar_landing.js'
import Chart from '../component/BiddersChart'
import 'react-slideshow-image/dist/styles.css'
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import pic1 from "../Artpics/Landingpic_7.png"
import pic2 from "../Artpics/Landingpic_1.png"
import pic3 from "../Artpics/Landingpic_4.png"
import axios from 'axios'
let user_email;
let user_cookie;


const fetchUsers = async () => {
  try {
    const response = await axios.get('https://squid-app-2-9gzet.ondigitalocean.app/users');
    // console.log(response.data[0].username);
    return Promise.resolve(response.data[0].username);
  } catch (error) {
    console.error(error);
  }
};



// Set cookie (initialise)
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


// Get cookie - check if first visit or not
function getCookie(cname) {
  let name = cname + "=";
  // console.log(document.cookie)
  let cookiedoc = document.cookie.split(';');
  for(let i = 0; i < cookiedoc.length; i++) {
    let c = cookiedoc[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Actual function - combines everything
export function CheckCookie(nameoremail) {
  if(nameoremail=="email"){
    let check_email = getCookie("email");
  if (check_email != "") {
      return(check_email);
    }
 else 
    return(false);
 
  }
  else
{
  let check_user = getCookie("username");
  if (check_user != "") {
      return(check_user);
    }
 else 
    return(false);



}

    

  }





function Landing()
{   
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/login`; 
    navigate(path);
  }
  const slideImages = [pic1, pic2, pic3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1));
  };
    user_cookie = CheckCookie("name");
    if(user_cookie!=false){
      return(
        <div> 
        <Navbar_landing></Navbar_landing>
        <br></br>
         <br></br>

               <br></br>
        <h>UMANG</h>
        <h3 class ="cookie">Welcome back {user_cookie}</h3>
        <div className='chartstyles'>
      <Chart className="chartthing" height={'45vh'} width={'50vw'} chartId={'63b629c0-e76a-4b83-8a50-1144282f8f33'} chartURL={'https://charts.mongodb.com/charts-project-0-mqzzv'} />
    </div>
        

      
{/* <Slide
  currentIndex={currentIndex}
  onChange={(index) => setCurrentIndex(index)}
  prevArrow={
    <button className="slide-button-prev-button" onClick={handlePrevious}>
      <MdKeyboardArrowLeft size={16} />
    </button>
  }
  nextArrow={
    <button className="slide-button-next-button" onClick={handleNext}>
      <MdKeyboardArrowRight size={16} />
    </button>
  }
>

        {slideImages.map((image, index) => (
          <div key={index} className="each-slide">
            <img src={image} className="landingpic" alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slide> */}



        <p class="para"> This website was designed by i-india GC members to make the bidding process as convininent as possible. Please visit the About section to find out more about the cause we support and the event itself, and find contact information regarding any issues or concerns. Happy bidding!
            </p>      
  
          
      </div>


      )

    }
    else
    {
      return(
        <div>
        <Navbar_landing />
         <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h>UMANG</h>
        <h3>Fall 2023</h3>
        
       <button class="register" onClick={routeChange}> Get Started </button> 
        <br></br>
        <br></br>
        <img src={pic1} class="landingpic"></img>
    
        <p class="para"> This website was designed by i-india GC members to make the bidding process as convininent as possible. Please visit the About section to find out more about the cause we support and the event itself, and find contact information regarding any issues or concerns. Happy bidding!
            </p>
        
        
        
        
        </div>

      )
    
    }
   
}

export default Landing; 
export {user_cookie};
