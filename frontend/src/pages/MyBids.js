
import './MyBids.css'
import Navbar_landing from '../component/Navbar_landing'
import { Container, Header, Grid, Segment } from 'semantic-ui-react';
import { CheckCookie } from './Landing';
import React, { Component, useEffect, useState, useRef } from 'react'
import axios from 'axios'
var mybids;


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
  function MyBids() {
    let [mybids, setMybids] = useState([]);
    let [totalbids, setTotal] = useState('');
  
    useEffect(() => {
      axios
        .get(`http://localhost:8000/mybids`, {
          params: {
            name: CheckCookie('name'),
          },
        })
        .then((response) => {
          setMybids(response.data);
          var sum = 0;
          let uniquepaintings = [];
          for (let j = response.data.length - 1; j >= 0; j--) {
            if (!uniquepaintings.includes(response.data[j].painting)) {
              sum += response.data[j].value;
            }
            uniquepaintings.push(response.data[j].painting);
          }
          setTotal(sum);
        });
    }, []);
  
    return (
      <div>
        <Navbar_landing />
        <h1>MY BIDS</h1>
        <table>
          <thead>
            <tr>
              <th>Painting Name</th>
              <th>Amount Bid</th>
            </tr>
          </thead>
          <tbody>
            {mybids.map((user) => (
              <tr key={user.painting}>
                <td>{paintingsTitles[user.painting]}</td> {/* Use paintingsTitles to map the painting ID to the actual title */}
                <td>{user.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>The total amount you have committed to donate so far is: ${totalbids}</p>
        <p>Thank you!</p>
      </div>
    );
  }
  
  export { MyBids };
  
