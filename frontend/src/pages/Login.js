import classes from './Login.css';
import Navbar from '../component/Navbar.js';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

var password = '';
var userdata = [];
var bids = [];
var admin = false;

const MySwal = withReactContent(Swal);

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000); // set expiry date for the cookie
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'; // creat cookie with name, value, expiry date and path to website
}

function Login() {
  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [userpassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  const onChangeName = (e) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  async function Verifyemail(userpassword) {
    console.log(userpassword, password);
    if (String(userpassword) === String(password)) {
      return true;
    } else {
      MySwal.fire({
        title: <strong>Wrong password, try again!</strong>,
        background: 'white',
        width: '35vmax',
        confirmButtonText: 'OK',
        buttonsStyling: false,
      });
      password = '';
      return false;
    }
  }

  function SendEmail() {
    var chars = '0123456789';
    var passwordLength = 5;
    password = '';
    for (var i = 0; i < passwordLength; i++) { // get random 5 digit password
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    var params = {
      name: name,
      email: email,
      userpass: password,
    };
    console.log('real' + password);
     emailjs.send("service_adnzlti","template_i1if82w",params,"e7AJH9FfOWzIXQQJm");
  }
    // console.log('actual password:' + password);
  async function ValidateEmail(emailcheck, name) {
    console.log('in validate email');
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailcheck)) {
      userpassword = '';
      console.log('name' + name);
      SendEmail();
      const { value, dismiss } = await MySwal.fire({
        title: <strong>We've just sent you a verification email with a password. Please enter your password here to proceed!</strong>,
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        background: 'white',
        buttonsStyling: false,
        width: '35vmax',
        preConfirm: (password) => {
          return password;
        },
        allowOutsideClick: () => !MySwal.isLoading(),
        allowEscapeKey: false, 
      });

      if (dismiss === 'cancel') {
// if cancel presssed do nothin
        return false;
      }

      userpassword = String(value);
      console.log('value' + value);

      if (await Verifyemail(userpassword) === true) {
        console.log('email verified');
        console.log('name' + name);
        return true;

      } else {
        console.log('not verified');
        return false;
      }
    } else {
      console.log('false email');
      MySwal.fire({
        title: <strong>Please enter a valid email address!</strong>,
        background: 'white',
        width: '35vmax',
        confirmButtonText: 'OK',
        buttonsStyling: false,
      });
      return false;
    }
  }

  async function CheckRepeat() {
    setCookie('email', email, 365);
    setCookie('username', name, 365);
    // console.log('in checkrepeat');
    await axios.get('http://localhost:8000/users').then(function (response) {
      console.log(response.data);
      userdata = response.data;
    });

    var i = 0;
    console.log(userdata);
    while (i < userdata.length) {
      console.log(userdata[i].useremail);
      if (email === userdata[i].useremail) {
        MySwal.fire({
          title: <strong>Welcome back {name} you're already registered</strong>,
          background: 'white',
          width: '35vmax',
          confirmButtonText: 'OK',
          buttonsStyling: false,
        });
        navigate('/display', { replace: true });
        return true;
      }
      i = i + 1;
    }
    return false; // Not a repeat
  }
  const CheckifAdmin = async (name,email) => {
    if (name === 'admin' && email === 'easthsi-india@gapps.uwcsea.edu.sg') {
      console.log("yes admin")
      const { value, dismiss } = await MySwal.fire({
        title: <strong>Please enter the password:</strong>,
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        background: 'white',
        buttonsStyling: false,
        width: '35vmax',
        preConfirm: (password) => {
          return password;
        },
        allowOutsideClick: () => !MySwal.isLoading(),
        allowEscapeKey: false, 
      });
  
      if (dismiss === 'cancel') {
        // If the user presses the cancel button, do nothing
        return false;
      }
  
      if (value === 'umang2021') {
        admin = true
        return true// Proceed to the /admin route
      } else {
        MySwal.fire({
          title: <strong>Wrong password, try again!</strong>,
          background: 'white',
          width: '35vmax',
          confirmButtonText: 'OK',
          buttonsStyling: false,
        });
      }
    } 
  }
  const submitHandler = async (e) => {
    e.preventDefault();
  
    console.log(name, email); // input from user
    const checkadmin = await CheckifAdmin(name,email);
    console.log("checkadmin"+checkadmin)
    if(checkadmin === true){
      navigate("/admin",{replace:true})
    }
   else {
      // For regular users, proceed with the existing flow
      if (!name || !email) {
        MySwal.fire({
          title: <strong>Please enter your name and email!</strong>,
          background: 'white',
          width: '35vmax',
          confirmButtonText: 'OK',
          buttonsStyling: false,
        });
        return;
      }

      if (await ValidateEmail(email, name) === false) {
        return;
      }

      if (await CheckRepeat() === false) {
        await axios
          .put('http://localhost:8000/users/logininfo', { name, email, bids })
          .then((data) => {
            console.log(data, 'userRegistered');
            navigate('/display', { replace: true });
          });
        MySwal.fire({
          title: <strong>Thanks for submitting, your response has been recorded</strong>,
          background: 'white',
          width: '35vmax',
          confirmButtonText: 'OK',
          buttonsStyling: false,
        });
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="card-container">
        <h2 className="loginhead">Enter your login details:</h2>
        <br />
        <br />
        <form className="everything">
          <label>Name</label>
          <input
            className="input"
            placeholder="Enter your full name"
            type="text"
            name="Name"
            onChange={onChangeName}
          />
          <br />
          <br />
          <label>Email</label>
          <input
            className="input"
            placeholder="Enter your email"
            type="email"
            name="Email"
            onChange={onChangeEmail}
          />
        </form>
        <br />
        <button className="button9" color="blue" onClick={submitHandler}>
          Register
        </button>
      </div>
      <br />
      <br />
      <br />
      <p className="disclaimer">
        <span className="redtext">NOTE:</span> By clicking Register you are agreeing that the UWCSEA I-India GC can
        collect and use the personal information submitted for the purpose of running this fundraising event. All data
        collected will be used in accordance with the UWCSEA Data Privacy and Collection Policy (available on the UWCSEA
        website.)
      </p>
    </div>
  );
}


export default Login;
export {admin};
