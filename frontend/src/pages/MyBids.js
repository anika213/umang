
import './MyBids.css'
import Navbar_landing from '../component/Navbar_landing'
import { CheckCookie } from './Landing';
import React, { Component, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { paintingsTitles } from './Highestbids';
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
  
