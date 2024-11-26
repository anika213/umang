
import classes from './About.css'
import Navbar_landing from '../component/Navbar_landing'
import {data} from './Display.js'
import axios from 'axios'
import {user_name} from './Landing'
import About_1 from '../Artpics/About_1.png'
import About_2 from '../Artpics/About_2.png'
import About_3 from '../Artpics/About_3.png'
import About_4 from '../Artpics/About_4.png'
import About_5 from '../Artpics/About_5.png'
import About_6 from '../Artpics/About_6.png'


     


function About()

{



    return (
      
    <div> 
      <Navbar_landing></Navbar_landing>
      <br></br>
       <br></br>
      <h1>About i-india</h1>
      <p class="abouttext">I-India is an organisation that provides holistic care for over 3000 street children in Jaipur, India. Therefore, your contribution and participation is deeply appreciated, especially during the aftermath of the coronavirus pandemic. All funds raised will support i-india’s 
            programmes which provide children from marginalised communities in Jaipur with access to shelter, education, nutrition, 
            medical care and vocational training skills. The proceeds from this auction will go to providing a computer course for girls specifically, hence increasing their employability and skillset regarding new technologies.
            </p>
        
            <img src={About_1} class="about1"></img>
            <img src={About_2} class="about2"></img>



      <h1>About the competition</h1>
      <p class="abouttext"> Umang started as an effort to use art, creativity, and imagination to positively 
            impact those in less privileged areas, specifically in Jaipur, India. Our aim was not only to raise funds for our NGO partner, 
            but to connect the UWC community on a wider level and showcase the talent across the different age groups. 
            The art competition Umang this year received around 70 submissions ranging from junior to high school, all of which is 
            displayed in the Main Plaza for viewing. The engagement with the exhibition has been remarkable, and we hope this event 
            can use art as a way to contribute to a better quality of life for street children in Jaipur whilst also highlighting the 
            commendable artistic talent within our own UWC community. Here's the NGO website if you want to find out more about them: https://www.i-indiaonline.com/

            </p>

        <img src={About_3} class="about3"></img>
        <img src={About_4} class="about4"></img>

      
        <h1>About the Auction</h1>
        <p class="abouttext"> The Umang Auction aims to raise funds for the i-India NGO, while 
     highlighting the exceptional talent within both the parent and student art community at the school. 
High-quality pieces of artwork are open for bidding to teachers, parents and other UWC community members. 
By connecting the pieces of artwork to the three themes (Change, Hope and Fantasy) we aim to unite diverse mediums and forms of art to celebrate the artistic achievements of the artists and raise funds for our NGO.

            </p>
       <img src={About_5} class="about5"></img>
      <img src={About_6} class="about6"></img>


      <h1>Contact Information</h1>
      <p>GC Email: easthsi-india@gapps.uwcsea.edu.sg</p>
      <p>Chair Email 1: vikra141445@gapps.uwcsea.edu.sg</p>
      <p>Chair Email 2: sivak14794@gapps.uwcsea.edu.sg</p>
      <p>Service Office Contact: zarinahuwc@gapps.uwcsea.edu.sg</p>
    </div>
    

    )
  


    
}

export {About}; 
