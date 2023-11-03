import classes from './ImageDisplay.css';
import {  Container } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { CheckCookie } from '../pages/Landing';
import { useState ,useEffect} from 'react';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';  // You seem to use axios but haven't imported it
import { checkIfBiddingDone } from '../pages/Login';

const MySwal = withReactContent(Swal);

export default function ImageDisplay(props) {
  const [imageLoaded, setImageLoaded] = useState(false);  // Create a local state variable
  const [isBiddingEnded, setIsBiddingEnded] = useState(false);

  useEffect(() => {
    const getBiddingInfo = async () => {
      if (await checkIfBiddingDone() === true) {
        setIsBiddingEnded(true);
      }
    };
    getBiddingInfo();
  }, []);
  
    useEffect(() => {
      MySwal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });
  
      return () => {
        MySwal.close();
      };
    }, []);
  
    const handleImageLoaded = () => {
      setImageLoaded(true);
      MySwal.close();
    };

  async function writeNote() { // Made it async since you use await inside
    console.log("write note");
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
    if(isBiddingEnded === true){
      //alert the user that they cant log in because bidding is done
      MySwal.fire({
        title: <strong>Sorry, You can't write a note, the Bidding has ended!</strong>,
        background: 'white',
        width: '35vmax',
        confirmButtonText: 'OK',
        buttonsStyling: false,
      });
      console.log("bidding ended")
      return;
    }
  
    
    const { value: text } = await MySwal.fire({
      title: '<strong>Our community artists have spent a lot of time and effort creating these paintings. Writing them a short note of appreciation would make their day :)</strong>',
      background: "white",
      width: "35vmax",
      confirmButtonText: 'Done',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      input: 'textarea',
      inputPlaceholder: 'Enter your text here',
      inputAttributes: {
        'rows': '10',
        'aria-label': 'Type your message here'
      }
    });
    
    if (text) {
      console.log('User input:', text);
      const note = text;  // 'note' is now defined as the user input
      console.log(note);
      let x = props.image.toString();
      let number = x.charAt(x.length - 1)
      const paintingnumber = "painting" +number;
      console.log(paintingnumber)
      
      try {
        const val = await axios.put('https://umang-react-usz25.ondigitalocean.app/paintings/writenote', { note, paintingnumber });
        
        if (val.status === 200) {
          MySwal.fire({
            title: '<strong>Thanks for your message, we\'ll pass it on to the artist!</strong>',
            background: "white",
            width: "35vmax",
            confirmButtonText: 'OK',
            buttonsStyling: false,
          });
        } else {
          MySwal.fire({
            title: '<strong>Sorry something went wrong, please try again.</strong>',
            background: "white",
            width: "35vmax",
            confirmButtonText: 'OK',
            buttonsStyling: false,
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        MySwal.fire({
          title: '<strong>Sorry something went wrong, please try again.</strong>',
          background: "white",
          width: "35vmax",
          confirmButtonText: 'OK',
          buttonsStyling: false,
        });
      }
    }
  }
  let displaySize = props.size;
  
  if (props.size === "horizontalupload") {
    displaySize = "horizontal";
  } else if (props.size === "verticalupload") {
    displaySize = "vertical";
  }
  
  return(
    <Container fluid className="container" id={props.title}> 
      <img 
        src={props.image} 
        alt="Painting 2"
        className={String(displaySize)}
        onClick={props.alert}
        onLoad={handleImageLoaded}  // Set the onLoad event
      />
      {imageLoaded && (  // Only render the following elements if the image is loaded
        <>
          <p className='artname'> {props.title}</p>
          <p1 className="blacktext">Current Highest bid: <span class="colortext">{props.bid}</span></p1>
          <br></br>
          <br></br>
          <button onClick={props.placebid} className = "buttonbid">Place a bid </button>  
          <button onClick={writeNote} className="buttonbid">Write a note</button>
          <br></br>
          <br></br>
          <br></br>
        </>
      )}
    </Container>
  );
}
