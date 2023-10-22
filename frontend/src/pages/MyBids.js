
import './MyBids.css'
import Navbar_landing from '../component/Navbar_landing'
import { CheckCookie } from './Landing';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

  function MyBids() {
    let [mybids, setMybids] = useState([]);
    let [totalbids, setTotal] = useState('');
    let [paintingsTitles, setPaintingTitles] = useState([]);
  
    useEffect(() => {
      axios
        .get(`https://umang-react-usz25.ondigitalocean.app/mybids`, {
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
  
    return (
      <div>


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
  
