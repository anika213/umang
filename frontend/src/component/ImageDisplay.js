import classes from './ImageDisplay.css'
import { Button, Form, Container, Header,  } from 'semantic-ui-react'

export default function ImageDisplay(props){
    console.log(props.bid)
    return(
        <Container fluid className="container"> 
        <img src={props.image} alt="Painting 2"
         class= {String(props.size)}
         onClick={props.alert}
         ></img>
        <p class='artname'> {props.title}</p>
        <p1 class="blacktext">Current Highest bid: <span class="colortext">{props.bid}</span></p1>
        <br></br>
        <br></br>
        <button onClick={props.placebid} class = "button1">Place a bid </button>  
        <br></br>
        <br></br>
        <br></br>

    </Container>
    )
}