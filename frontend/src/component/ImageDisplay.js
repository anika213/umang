import classes from './ImageDisplay.css';
import {  Container } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';  // You seem to use axios but haven't imported it

const MySwal = withReactContent(Swal);

export default function ImageDisplay(props) {
  async function writeNote() { // Made it async since you use await inside
    console.log("write note");
    
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
      const paintingnumber = "painting" + props.image[21];
      
      try {
        const val = await axios.put('http://localhost:8000/paintings/writenote', { note, paintingnumber });
        
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

  console.log(props.bid);

  return(
    <Container fluid className="container" id={props.title}> 
    <img src={props.image} alt="Painting 2"
     className= {String(props.size)}
     onClick={props.alert}
     ></img>
    <p className='artname'> {props.title}</p>
    <p1 className="blacktext">Current Highest bid: <span class="colortext">{props.bid}</span></p1>
    <br></br>
    <br></br>
    <button onClick={props.placebid} className = "button1">Place a bid </button>  
    <button onClick={writeNote} className="button1">Write a note</button>
    <br></br>
    <br></br>
    <br></br>

</Container>
)
}
