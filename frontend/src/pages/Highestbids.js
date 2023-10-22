import classes from './Highestbids.css'
import { BrowserRouter, json, renderMatches, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Component } from 'react'
import Swal from 'sweetalert2';

import Navbar_landing from '../component/Navbar_landing.js'
import React, { useEffect, useState } from "react";
import useInterval from 'use-interval'
import axios from 'axios';
import h1 from './Display';

//  const paintingsTitles = {
//     painting19: "Journey by Sona Arora",
//     painting2: "Bharatnatyam by Deepa Remani",
//     painting3: "Childhood by Anita Yang",
//     painting1: "Buddha's Reflections by Milan Khatri",
//     painting4: "Ocean of Brilliance! by Arppanaa John Yogesh",
//     painting6: "Aasha ki Kiran by Sanjana Krishna",
//     painting7: "Yunnan Impression: The Blooming of Chinese Hibiscus by Peng Yaling",
//     painting8: "Monet's Gardens Impression: Water Lily by Peng Yaling",
//     painting9: "Good Times by Aparna Chakravarty",
//     painting10: "The Nameless Buddha by Peng Yaling",
//     painting11: "The Dunhuang Buddha Statue by Peng Yaling",
//     painting12: "Let There Be Light by Shailaja Poddar",
//     painting13: "Bauhinia Fantasy by Amae Fung",
//     painting14: "Lost in Thought by Ganesh Bhat",
//     painting15: "Forgotten by Surabhi Nigam",
//     painting16: "Memories - Koi in a pond with lotus leaves! by Pratibha Malashetti",
//     painting17: "Yaggya - Havan Kund by Pratibha Malashetti",
//     painting18: "Ebb and Flow by Nisha Farah-Reijsbergen",
//     painting5: "Virikatirkal(விரிகதிர்கள்)- Divergent Rays by Nisha Farah-Reijsbergen",
//   };
  function Highestbids() {
    let [HighestBidsValues, setHighestBidsValues] = useState([]);
    let [HighestBiddersValues, setHighestBiddersValues] = useState([]);
    let [paintingsTitles, setPaintingTitles] = useState([]);
    let [numberOfPaintings, setNumberOfPaintings] = useState(0);
    let [isLoading, setIsLoading] = useState(true); // Maintain this state
  
    useEffect(() => {
      // Show the loading popup
      Swal.fire({
        title: '<div>Loading...</div><div><br></br><img src="loading-icon.png"/></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      
      
      
      // axios.get('https://frontend-umang-ttltu.ondigitalocean.app/allbids/getallhighest')
      //   .then((response) => {
      //     setHighestBidsValues(response.data);
      //   });
    
      axios.get('https://frontend-umang-ttltu.ondigitalocean.app/allbids/getallhighestbidders')
        .then((response) => {
          setHighestBiddersValues(response.data);
  
          // Close the loading popup
          Swal.close();
          setIsLoading(false);
        });
    }, []);
  

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://frontend-umang-ttltu.ondigitalocean.app/paintinginfo');
          // Accessing the properties in the response
          const titles = response.data.titles;
          const sizes = response.data.sizes;
          const descriptions = response.data.descriptions;
          const highestBids = response.data.highestBids;
          const imageurls = response.data.images;
          
          // Update the state variables
          setPaintingTitles(titles);
          setHighestBidsValues(highestBids);
    
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
    const artPieces = Array.from({ length: 30 }, (_, index) => index + 1); // Changed from numberOfPaintings to 50
    return (
      <div>
        <Navbar_landing />
        <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className={isLoading ? "blur-content" : ""}>
        </div>
        </div>
        <h1> Highest Bids</h1>
        <div className="bidstext">
      {artPieces.map((number) => {
        const paintingKey = `painting${number}`;
        if (!paintingsTitles[paintingKey]) {
          return null; // Skip this iteration if the painting doesn't exist in paintingsTitles
        }
        return (
          <p key={number}>
            <span className={HighestBiddersValues[paintingKey] === "Minimum Bid" ? "redtext" : "bluetext"}>
              {paintingsTitles[paintingKey]}
            </span>
            :{" "}
            <span className="boldtext">{HighestBidsValues[paintingKey]}</span> Bid By {HighestBiddersValues[paintingKey]}
          </p>
        );
      })}
    </div>
      </div>
    );
  }
  
  export { Highestbids };

