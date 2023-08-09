import classes from './Highestbids.css'
import { BrowserRouter, json, renderMatches, Route, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Component } from 'react'
import Navbar_landing from '../component/Navbar_landing.js'
import React, { useEffect, useState } from "react";
import useInterval from 'use-interval'
import axios from 'axios';
import h1 from './Display';

const paintingsTitles = {
    painting1: "Journey by Sona Arora",
    painting2: "Bharatnatyam by Deepa Remani",
    painting3: "Childhood by Anita Yang",
    painting4: "Buddha's Reflections by Milan Khatri",
    painting5: "Ocean of Brilliance! by Arppanaa John Yogesh",
    painting6: "Aasha ki Kiran by Sanjana Krishna",
    painting7: "Yunnan Impression: The Blooming of Chinese Hibiscus by Peng Yaling",
    painting8: "Monet's Gardens Impression: Water Lily by Peng Yaling",
    painting9: "Good Times by Aparna Chakravarty",
    painting10: "The Nameless Buddha by Peng Yaling",
    painting11: "The Dunhuang Buddha Statue by Peng Yaling",
    painting12: "Let There Be Light by Shailaja Poddar",
    painting13: "Bauhinia Fantasy by Amae Fung",
    painting14: "Lost in Thought by Ganesh Bhat",
    painting15: "Forgotten by Surabhi Nigam",
    painting16: "Memories - Koi in a pond with lotus leaves! by Pratibha Malashetti",
    painting17: "Yaggya - Havan Kund by Pratibha Malashetti",
    painting18: "Ebb and Flow by Nisha Farah-Reijsbergen",
    painting19: "Virikatirkal(விரிகதிர்கள்)- Divergent Rays by Nisha Farah-Reijsbergen",
  };


function Highestbids() {
    let [HighestBidsValues, setHighestBidsValues] = useState([]);
    let [HighestBiddersValues, setHighestBiddersValues] = useState([]);
  
    useEffect(() => {
      axios.get('http://localhost:8000/allbids/getallhighest')
        .then((response) => {
          setHighestBidsValues(response.data);
        });
  
      axios.get('http://localhost:8000/allbids/getallhighestbidders')
        .then((response) => {
          setHighestBiddersValues(response.data);
        });
    }, []);
  
    const artPieces = Array.from({ length: 19 }, (_, index) => index + 1);
  
    return (
      <div>
        <Navbar_landing></Navbar_landing>
        <h1> Highest Bids</h1>
        <div class="bidstext">
          {artPieces.map((number) => (
            <p key={number}>
              <span class="bluetext">{paintingsTitles[`painting${number}`]}:</span> <span class="boldtext">{HighestBidsValues[`painting${number}`]}</span> Bid By {HighestBiddersValues[`painting${number}`]}
            </p>
          ))}
        </div>
      </div>
    );
  }
  
  export { Highestbids };
  