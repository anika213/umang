import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Display from './pages/Display';
import {About} from './pages/About';
import {MyBids} from './pages/MyBids';
import {Highestbids} from './pages/Highestbids';
import {Admin} from './pages/AdminInterface';
import 'react-toastify/dist/ReactToastify.css';

function App() {



    return (
<Router>
           <div className="App">
    <Routes>
                <Route exact path='/' element={< Landing />}></Route>
                 <Route exact path='/login' element={< Login />}></Route>
                 <Route exact path='/display' element={< Display />}></Route>
                 <Route exact path='/highestbids' element={< Highestbids />}></Route>
                 <Route exact path='/about' element={< About />}></Route>
                 <Route exact path='/mybids' element={< MyBids />}></Route>  
                 <Route exact path='/admin' element={< Admin />}></Route>
                 
          </Routes>
          
</div>
</Router>





   );
  }


export default App;