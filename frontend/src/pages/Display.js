import Artpic_1 from '../Artpics/Artpic_1.png';
import Artpic_2 from '../Artpics/Artpic_2.png';
import Artpic_3 from '../Artpics/Artpic_3.png';
import Artpic_4 from '../Artpics/Artpic_4.png';
import Artpic_5 from '../Artpics/Artpic_5.png';
import Artpic_6 from '../Artpics/Artpic_6.png';
import Artpic_7 from '../Artpics/Artpic_7.png';
import Artpic_8 from '../Artpics/Artpic_8.png';
import Artpic_9 from '../Artpics/Artpic_9.png';
import Artpic_10 from '../Artpics/Artpic_10.png';
import Artpic_11 from '../Artpics/Artpic_11.png';
import Artpic_12 from '../Artpics/Artpic_12.png';
import Artpic_13 from '../Artpics/Artpic_13.png';
import Artpic_14 from '../Artpics/Artpic_14.png';
import Artpic_15 from '../Artpics/Artpic_15.png';
import Artpic_16 from '../Artpics/Artpic_16.png';
import Artpic_17 from '../Artpics/Artpic_17.png';
import Artpic_18 from '../Artpics/Artpic_18.png';
import Artpic_19 from '../Artpics/Artpic_19.png';
import emailjs from '@emailjs/browser'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactDOM from 'react-dom';
import ModalImage from "react-modal-image";
import classes from './Display.css';
import Navbar_landing from '../component/Navbar_landing.js'
import React, { useState, useEffect} from 'react';
import Tabletop from "tabletop";
import Navbar from '../component/Navbar.js';
import { Button, Form, Container, Header,  } from 'semantic-ui-react'
import Login from './Login.js'
import axios from 'axios';
import { CheckCookie } from './Landing';
import {exp1} from './Highestbids';
import ImageDisplay from '../component/ImageDisplay';
import swal from 'sweetalert';
let rowcount = 1;
let y =0;
export var h1 = 70;
const MySwal = withReactContent(Swal)
var highestbid;
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

console.log(paintingsTitles);

   

async function bid(art_number){   //TODO: DISPLAY VALUES ONTO SCREEN

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
    .then((val)=>{
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
             emailjs.send("service_adnzlti","template_fh02zsq",params,"e7AJH9FfOWzIXQQJm");
        }
    });
   
}



    

function alert1(){
    
    MySwal.fire({
            title: <strong>Journey by Sona Arora</strong>,
            html:
            <div>
                <span>DESCRIPTION:</span> 
                <br></br>
                <p1>I call my painting journey and for me it's a discovery of self  which I felt is not smooth but beautiful and fulfilling. </p1>
                <br></br>
                <br></br>
                <p1><span>MEDIUM:</span> Acrylic Canvas </p1>
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


function alert2(){
    
MySwal.fire({
        title: <strong>Bharatnatyam by Deepa Remani</strong>,
        html:
        <div>
            <span>DESCRIPTION:</span> 
            <br></br>
            <p1>Bharatanatyam, one of the oldest dance forms in India, has its origins in the temples of South India. Overtime, it has evolved as a performing art in theatres. This dance form had contributed much to the development of other art forms of India and influenced temple architecture in South India. Thus, it forms a part of India's heritage. </p1>
            <br></br>
            <br></br>
            <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
            <br></br>
            <p1><span>THEME:</span> Heritage </p1>
            <br></br>
            <p1><span>SIZE:</span> 30cm x 40cm</p1>
            </div>,
        background:"black",
        width: "50vmax",
        showConfirmButton: false,


      })  
    
    }

function alert3(){
    
        MySwal.fire({
                title: <strong>Childhood by Anita Yang</strong>,
                html:
                <div>
                    <span>DESCRIPTION:</span> 
                    <br></br>
                    <p1>I chose the theme of memories so I think of childhood memories. My childhood memories are very precious that I really miss it. The little girl in the artwork trying to get the ball in the sea, she was on the beach but the sea has receded. She is wearing a little girl dress where everyone has wear it before when they're small and her outfit like her hat and her slippers represent she has a very relaxing and chill time when she is a little girl.</p1>
                    <br></br>
                    <br></br>
                    <p1><span>MEDIUM:</span> Oil paint Canvas </p1>
                    <br></br>
                    <p1><span>THEME:</span> Memories </p1>
                    <br></br>
                    <p1><span>SIZE:</span> Approx. A3</p1>
                    </div>,
                background:"black",
                width: "50vmax",
                showConfirmButton: false
        
              })  
            
            }



    function alert4(){
    
        MySwal.fire({
                title: <strong>Buddha's Reflections by Milan Khatri</strong>,
                html:
                <div>
                    <span>DESCRIPTION:</span> 
                    <br></br>
                    <p1>Growing up as a Hindu in the UK, Hinduism did not penetrate beyond the Indian community. Its only later in life that I came across Buddha, and most starkly in Thailand. I realized that India has a rich and deep heritage, and in the case of Buddha is shared globally. </p1>
                    <br></br>
                    <br></br>
                    <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                    <br></br>
                    <p1><span>THEME:</span> Heritage </p1>
                    <br></br>
                    <p1><span>SIZE:</span> 51cm x 40cm</p1>
                    </div>,
                background:"black",
                width: "50vmax",
                showConfirmButton: false,
                border: "3px"
        
        
              })  
            
            }


function alert5(){
    
                MySwal.fire({
                        title: <strong>Ocean of Brilliance! by Arppanaa John Yogesh</strong>,
                        html:
                        <div>
                            <span>DESCRIPTION:</span> 
                            <br></br>
                            <p1>Traditional art provides values and beliefs which are passed down through generations. This kind of artwork called ‘Mandala’ is derived from the ancient Sanskrit language which means circles. This is a traditional form of art that is associated with meditation, healing, prayers and therapy. This thought  proving piece of art seems to bring much needed optimism in these times of despondency. </p1>
                            <br></br>
                            <br></br>
                            <p1><span>MEDIUM:</span> Paint, Colour Pencils/Pens (Framed)</p1>
                            <br></br>
                            <p1><span>THEME:</span> Heritage </p1>
                            <br></br>
                            <p1><span>SIZE:</span> 16in x 21in</p1>
                            </div>,
                        background:"black",
                        width: "50vmax",
                        showConfirmButton: false,
                        border: "3px"
                
                
                      })  
                    
                    }

    function alert6(){
    
                        MySwal.fire({
                                title: <strong>Aasha ki Kiran </strong>,
                                html:
                                <div>
                                    <span>DESCRIPTION:</span> 
                                    <br></br>
                                    <p1>Set in the surroundings of the world heritage site Hawa Mahal, this painting encompasses the long lasting tradition of devout piety which for many in India is a way of life. The title Aasha ki Kiran,  denoting 'ray of hope' signifies the artist's fond wish for a better life for the homeless children in Jaipur. </p1>
                                    <br></br>
                                    <br></br>
                                    <p1><span>MEDIUM:</span> Acrylics Canvas</p1>
                                    <br></br>
                                    <p1><span>THEME:</span> Heritage </p1>
                                    <br></br>
                                    <p1><span>SIZE:</span> 14 x 18 inches</p1>
                                    </div>,
                                background:"black",
                                width: "50vmax",
                                showConfirmButton: false,
                                border: "3px"
                        
                        
                              })  
                            
                            }

function alert7(){
    
           MySwal.fire({
                          title: <strong>Yunnan Impression: The Blooming of Chinese Hibiscus </strong>,
                                html:
                                <div>
                                        <span>DESCRIPTION:</span> 
                                            <br></br>
                                            <p1>"To see a world in a grain of sand, And a heaven in a wild flower." - This is a Chinese hibiscus flower I encountered when travelling to the Yunnan province of China. Reflecting on the journey of life, there are always some beautiful things deeply engraved in my heart from a special moment of time.</p1>
                                            <br></br>
                                            <br></br>
                                            <p1><span>MEDIUM:</span> Watercolour (Framed)</p1>
                                            <br></br>
                                            <p1><span>THEME:</span> Memories </p1>
                                            <br></br>
                                            <p1><span>SIZE:</span> 42 x 29.7 cm (without frame)</p1>
                                            </div>,
                                        background:"black",
                                        width: "50vmax",
                                        showConfirmButton: false,
                                        border: "3px"
                                
                                
                                      })  
                                    
    }

    
function alert8(){
    
        MySwal.fire({
                       title: <strong>Monet's Gardens Impression: Water Lily </strong>,
                             html:
                             <div>
                                     <span>DESCRIPTION:</span> 
                                         <br></br>
                                         <p1>I visited Monet's garden on a trip to Europe a few years ago to see the beauty of light and shadow, and discovered the beautiful scene of a water lily blooming silently in his world-famous pond. Great beauty knows no borders, and I would also like to dedicate this painting to one of my favorite Impressionist painter, Claude Monet.</p1>
                                         <br></br>
                                         <br></br>
                                         <p1><span>MEDIUM:</span> Watercolour (Framed)</p1>
                                         <br></br>
                                         <p1><span>THEME:</span> Discovery </p1>
                                         <br></br>
                                         <p1><span>SIZE:</span> 39 x 27 cm (without frame)</p1>
                                         </div>,
                                     background:"black",
                                     width: "50vmax",
                                     showConfirmButton: false,
                                     border: "3px"
                             
                             
                                   })  
                                 
 }

 function alert9(){
    
    MySwal.fire({
                   title: <strong>Good Times </strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Memories. Joyful memories, good memories. That's what my painting depicts. There are small glitches, grey and black areas but they are far too less and the colourful ones outnumber the darker memories. I am thankful for these good times that I keep looking back on, from time to time.</p1>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic (acrylic pour, acrylic paint, acrylic ink)</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Memories </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 45cm x 60cm</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }


function alert10(){
    
    MySwal.fire({
                   title: <strong>The Nameless Buddha</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1> Buddhist culture has a long history and far-reaching influence in Asia. In China, there are numerous grottoes and Buddha culture scattered in various famous mountains and rivers, such as the Longmen Grottoes, Dunhuang Mogao Grottoes and so on. These solemn Buddha statues, overlooking all living beings with a compassionate attitude, have silently experienced countless wind and rain in the long river of time.</p1>
                                     <br></br>
                                     <br></br>
                                    
                                     <p1><span>MEDIUM:</span> Watercolour</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                    <br></br>
                                     <p1><span>SIZE:</span> 42 x 29.7 cm (without frame)</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }
 
 function alert11(){
    
    MySwal.fire({
                   title: <strong>The Dunhuang Buddha Statue</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>The artwork portrays a small Buddha statue. It is known as one of the most beautiful painted Buddha statues in Dunhuang, and it is found in Cave 45 of the Mogao Grottoes. The Buddha's expression is soft and his smile gives a sense of calmness and happiness to all its audiences.</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Watercolour</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 16 x 12 cm (without frame)</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert12(){
    
    MySwal.fire({
                   title: <strong>Let There Be Light</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1 class="poemsize"> Ambling down slowly, on a clear balmy night.<br></br>
                                        With a gentle breeze blowing, and the weather just right!<br></br>
                                        The night sky grew brighter, towards the approaching site, <br></br>
                                        With a thousand lit lanterns, floating as if in flight. <br></br>
                                        Bright vibrant orbs soaring, at differing heights, <br></br>
                                        Throwing quick moving shadows, like little dancing sprites. <br></br>
                                        A scene to remember, a most captivating sight. <br></br>
                                        Myriads of shapes, like a sky studded with kites, <br></br>
                                        ith a feeling most tranquil & a stargazer’s delight, <br></br>
                                        I almost heard a soft whisper…. ‘Let there be light!’ </p1>
                                     <br></br>
                                     <br></br>
                                     <p1>An ode to Singapore’s ethos of a rich, multicultural heritage, racial harmony and religious tolerance. This work of art has been inspired by Shailaja’s most enduring memories of Singapore when she moved here over many years back, fascinated by the vibrant cultural enclaves of Chinatown, Little India and Geylang Serai. While reflecting on the vast differences in Singapore’s thriving communities, she marvelled at just how beautifully they intertwined to form a bright, colourful tapestry, making what is today - Singapore’s own unique culture. Besides, with amazement, she noticed how similar they were in their deep reverence for their own culture while being respectful towards that of the others. Of the few customs that they all had in common, one stood out, in particular. The practice of lighting lanterns during festivals has been an integral part of Chinese, Indian, Malay and Eurasian traditions. Believed to bring in spiritual illumination and enlightenment, lanterns have long symbolized ‘hope in despair’ and the ‘victory of good over evil’. In this piece, she brings together traditional Chinese, Malay, Indian, Thai, Vietnamese and Christmas lanterns, to make a colourful vignette exuding auspiciousness, hope and positivity.</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 23"X33"</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }
 function alert13(){
    
    MySwal.fire({
                   title: <strong>Bauhinia Fantasy</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Bauhinia Fantasy depicts my favourite parts of Hong Kong culture woven together into a crown. In times when I miss my home away from home, I find comfort in dreaming about all the things that make Hong Kong so special. The culture and legacy of Hong Kong have shaped me into who I am today, and I’m eager to celebrate that in my art!</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> A2 (16.5 x 23.4 inches)</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }
 function alert14(){
    
    MySwal.fire({
                   title: <strong>Lost in Thought</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>The painting is a replication of Michelangelo's 'David' in a modern style of Louis Jover. I also wanted to use colours which represent India(orange). It relates to the theme of 'Memories' as it is a replica of an old masterpiece.</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic on Wood</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Memories </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 600cm x 495cm</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert15(){
    
    MySwal.fire({
                   title: <strong>Forgotten</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Our heritage is filled with old forts and antique buildings. Forgotten yet standing strong, this artwork depicts the charismatic heritage of Indian architecture.</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 30 x 40 cm</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert16(){
    
    MySwal.fire({
                   title: <strong>Memories - Koi in a pond with lotus leaves!</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Memories  - Koi fish in water with lotus leaves represents Fun, Unity and Longevity!</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Memories </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 24" x 36"</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert17(){
    
    MySwal.fire({
                   title: <strong>Yaggya - Havan Kund</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Heritage of Yaggya - Felt was lost but has been regained in recent past by many in different parts of the World. A small glimpse !!</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Heritage </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 20" by 24"</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert18(){
    
    MySwal.fire({
                   title: <strong>Ebb and flow</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Every moment in life that we experience shapes our thoughts and identity. Each experience is intertwined with another, continuously making new ones, and driving our curiosity. These experiences take us on many different paths, connecting and weaving into other experiences whilst creating new ones. Every discovery is special and is interconnected to another experience yet to come. </p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Discovery </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 20cm by 40cm</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }

 function alert19(){
    
    MySwal.fire({
                   title: <strong>Virikatirkal(விரிகதிர்கள்)- Divergent Rays</strong>,
                         html:
                         <div>
                                 <span>DESCRIPTION:</span> 
                                     <br></br>
                                     <p1>Discovery starts from a point and it can lead us to many different paths. These paths are divergent, paths are narrow, some are wide, and some are interconnected and weaved. These paths are unending and can bring an array of possibilities and journeys as long as we are moving. Like divergent rays, (விரிகதிர்கள்) our rays can travel to different experiences.</p1>
                                     <br></br>
                                     <br></br>
                                     <p1><span>MEDIUM:</span> Acrylic Canvas</p1>
                                     <br></br>
                                     <p1><span>THEME:</span> Discovery </p1>
                                     <br></br>
                                     <p1><span>SIZE:</span> 20cm by 40cm</p1>
                                     </div>,
                                 background:"black",
                                 width: "50vmax",
                                 showConfirmButton: false,
                                 border: "3px"
                         
                         
                               })  
              
 }
 
 

function Display()
{ 

    let [HighestBidsValues,setHighestBidsValues]=useState({});
    axios.get('http://localhost:8000/allbids/getallhighest')
    .then((response) => {
        setHighestBidsValues(response.data);
        // console.log(response.data)
        })
        // console.log("in display"+HighestBidsValues.painting1)
        return (
          <div>
            <Navbar_landing></Navbar_landing>
            <div id="root" style={{ padding: '5%' }}>   
              <h1>Art Gallery</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                <ImageDisplay image={Artpic_4} title={paintingsTitles.painting4} size="image2" bid={HighestBidsValues.painting4} alert={alert4} placebid={() => bid(4)}></ImageDisplay>
                <ImageDisplay image={Artpic_2} title={paintingsTitles.painting2} size="image2" bid={HighestBidsValues.painting2} alert={alert2} placebid={() => bid(2)}></ImageDisplay>
                <ImageDisplay image={Artpic_6} title={paintingsTitles.painting6} size="image2" bid={HighestBidsValues.painting6} alert={alert6} placebid={() => bid(6)}></ImageDisplay>
                <ImageDisplay image={Artpic_12} title={paintingsTitles.painting12} size="image2" bid={HighestBidsValues.painting12} alert={alert12} placebid={() => bid(12)}></ImageDisplay>
                <ImageDisplay image={Artpic_13} title={paintingsTitles.painting13} size="image2" bid={HighestBidsValues.painting13} alert={alert13} placebid={() => bid(13)}></ImageDisplay>
                <ImageDisplay image={Artpic_14} title={paintingsTitles.painting14} size="image2" bid={HighestBidsValues.painting14} alert={alert14} placebid={() => bid(14)}></ImageDisplay>
                <ImageDisplay image={Artpic_3} title={paintingsTitles.painting3} size="image3" bid={HighestBidsValues.painting3} alert={alert3} placebid={() => bid(3)}></ImageDisplay>
                <ImageDisplay image={Artpic_1} title={paintingsTitles.painting1} size="image3" bid={HighestBidsValues.painting1} alert={alert1} placebid={() => bid(1)}></ImageDisplay>
                <ImageDisplay image={Artpic_5} title={paintingsTitles.painting5} size="image3" bid={HighestBidsValues.painting5} alert={alert5} placebid={() => bid(5)}></ImageDisplay>
                <ImageDisplay image={Artpic_8} title={paintingsTitles.painting8} size="image2" bid={HighestBidsValues.painting8} alert={alert8} placebid={() => bid(8)}></ImageDisplay>
                <ImageDisplay image={Artpic_9} title={paintingsTitles.painting9} size="image2" bid={HighestBidsValues.painting9} alert={alert9} placebid={() => bid(9)}></ImageDisplay>
                <ImageDisplay image={Artpic_10} title={paintingsTitles.painting10} size="image2" bid={HighestBidsValues.painting10} alert={alert10} placebid={() => bid(10)}></ImageDisplay>
                <ImageDisplay image={Artpic_15} title={paintingsTitles.painting15} size="image2" bid={HighestBidsValues.painting15} alert={alert15} placebid={() => bid(15)}></ImageDisplay>
                <ImageDisplay image={Artpic_7} title={paintingsTitles.painting7} size="image2" bid={HighestBidsValues.painting7} alert={alert7} placebid={() => bid(7)}></ImageDisplay>
                <ImageDisplay image={Artpic_11} title={paintingsTitles.painting11} size="image2" bid={HighestBidsValues.painting11} alert={alert11} placebid={() => bid(11)}></ImageDisplay>
                <ImageDisplay image={Artpic_16} title={paintingsTitles.painting16} size="image2" bid={HighestBidsValues.painting16} alert={alert16} placebid={() => bid(16)}></ImageDisplay>
                <ImageDisplay image={Artpic_17} title={paintingsTitles.painting17} size="image2" bid={HighestBidsValues.painting17} alert={alert17} placebid={() => bid(17)}></ImageDisplay>
                <ImageDisplay image={Artpic_18} title={paintingsTitles.painting18} size="image4" bid={HighestBidsValues.painting18} alert={alert18} placebid={() => bid(18)}></ImageDisplay>
                <ImageDisplay image={Artpic_19} title={paintingsTitles.painting19} size="image4" bid={HighestBidsValues.painting19} alert={alert19} placebid={() => bid(19)}></ImageDisplay>
              </div>
            </div>
          </div>
        );
        








    
      
             
   
}
export  default Display;

