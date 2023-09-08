const express = require('express');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const mongoose = require("mongoose");
const axios= require("axios");
const { getApp } = require('firebase-admin/app');
const app = express();
const router = express.Router()


const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
const database = client.db(process.env.DATABASE_NAME);
const users = database.collection('users');
const paintings = database.collection('paintings');
async function connection(){
    try {
        // Connect to the mongo cluster
        await client.connect();
        console.log("connected to MONGOdb")
       
    } catch (e) {
        console.error(e);
}
}
connection().catch(console.error);



getUserEmails = async () => {
    return await users.find().toArray()
}


getAllBids = async () => {
    
    return await paintings.find().toArray()
}

getHighestBid = async (artpiece) => {
    return await paintings.find({"painting":artpiece}).toArray()
}

getMyBids = async (userName) => {
    var mybidsdata = await users.find({"username":userName}).toArray()
    return(mybidsdata[0].userbids);
}


getAllHighestBidders = async () => {
    let allinfo = await paintings.find({}, { "_id": 0, "painting": 1 }).toArray();
    var highestBidsData = {};
  
    for (var i = 0; i < allinfo.length; i++) {
      const number = allinfo[i].painting.toString();
      highestBidsData[number] = allinfo[i].highestBid.bidder;
    }
  
    return highestBidsData;
}


getAllHighestBids = async () => {
    let allinfo = await paintings.find({}, { "_id": 0, "painting": 1 }).toArray();
    var highestBidsData = {};
  
    for (var i = 0; i < allinfo.length; i++) {
      const number = allinfo[i].painting.toString();
      highestBidsData[number] = allinfo[i].highestBid.bidvalue;
    }
  
    return highestBidsData;
  };


  getAllNotes = async () => {
    let allinfo = await paintings.find({}, { "_id": 0, "painting": 1 }).toArray();
    var NotesData = {};
    var allnotes =[]
    for (var i = 0; i < allinfo.length; i++) {
      const number = allinfo[i].painting.toString();
      allnotes =[]
      for(var j=0;j<allinfo[i].notes.length;j++){
        allnotes.push(allinfo[i].notes[j]);
      }
    NotesData[number] = allnotes;
    }
    return NotesData
  
  };
  
addWriteNote = async (note,paintingnumber) => {
    console.log(note)
    console.log(paintingnumber)
    paintings.updateOne(
        {"painting":paintingnumber},
        {$push:
        {"notes":note}},
        {
          upsert:true
        }

     )    
     return true


}


  getAllBiddinginfo = async () => {
  
    var highestbidsdata = await getAllHighestBids();
    var highestbiddersnames = await getAllHighestBidders();
    var notes = await getAllNotes();
    console.log(notes)
    console.log(highestbidsdata);
  
    var highestbiddersemails = {};
    for (const paintingNumber in highestbiddersnames) {
      const bidderName = highestbiddersnames[paintingNumber];
      var bidderemail = await users.find({"username": bidderName}).toArray();
  
      // Check if bidderemail is found and has at least one entry
      if (bidderemail.length > 0 && bidderemail[0].useremail) {
        highestbiddersemails[paintingNumber] = bidderemail[0].useremail;
      } else {
        highestbiddersemails[paintingNumber] = "TEST"; // If not found, set to "TEST"
      }
    }
    
    console.log(highestbiddersemails);
    return [highestbidsdata, highestbiddersnames, highestbiddersemails, notes];
  }
  


app.use(cors());
app.use(express.json());


app.get("/users", async (req, res) => {
    const emails = await getUserEmails()
    res.json(emails) 
})



app.put("/paintings/writenote", async (req, res) => {
   const{note,paintingnumber} = req.body;
    console.log(note)
    var check = await addWriteNote(note,paintingnumber)
    if(check==true)
        res.send({status:"OK"})
    else{
        res.send({status:"ERROR"})
    }
})




app.put("/users/logininfo",  async (req, res) => {

    try{
        const {name,email,bids} = req.body
        users.insertOne(

                    {"username":name,
                    "useremail":email,
                    "userbids":bids}
                )
        res.send({status:"ok"})
    }
    catch(error){
        res.send({status:"error"})
        console.log(error);

    }
})


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });

 
  app.put("/allbids/bidplaced", async (req, res) => {
    try{
        const {name,bidvalue,paintingnumber} = req.body
        updatedVal = {
            "bidder":name,
            "bidvalue":bidvalue
        }
        paintings.updateOne(
            {"painting":paintingnumber},
            {$set:{
            "highestBid":updatedVal}},
            {
              upsert:true
            }
         )
        res.send({status:"ok"})
    }
    catch(error){
        res.send({status:"error"})
        console.log(error);

    }
    
})


let userLastBidTime = {};

app.put("/allbids/placebid", async (req, res) => {
    const { paintingnumber, name, bidvalue } = req.body;
    console.log(paintingnumber, name, bidvalue);
    const data = await getHighestBid(paintingnumber);
    const highestBidder = data[0].highestBid.bidder;
    const highestBidderEmail = await users.find({"username":highestBidder}).toArray()
    console.log(highestBidderEmail[0].useremail)
    const currentTime = new Date();
    if (userLastBidTime[name] && ((currentTime - userLastBidTime[name]) / 1000) < 10) {
        console.log("error: bid too soon"); 
        res.status(200).send("time"); // alert on frontend
        return;
    }

    if (bidvalue > data[0].highestBid.bidvalue) {
        userLastBidTime[name] = currentTime;
        axios.put('http://localhost:8000/allbids/bidplaced',  
        { name, bidvalue, paintingnumber,highestBidderEmail })  
        .then((data) => {
            console.log("bidplaced"); 
            res.status(200).send(highestBidderEmail);
        })

        axios.put('http://localhost:8000/allbids/mybids',  
        { name, bidvalue, paintingnumber })
        .then((data) => {
            console.log("mybids")
        })
    } else {
        console.log("error: bid not greater"); 
        res.status(200).send("value"); // alert on frontend
    }
});




app.get("/allbids/biddinginfo", async (req, res) => {
    const data = await getAllBiddinginfo()
    res.json(data)
  })


app.put("/allbids/mybids", async (req, res) => {
    try{
        const {name,bidvalue,paintingnumber} = req.body
        var MyBid = {
            "painting":paintingnumber,
            "value":bidvalue
        }
        users.updateOne(
            {"username":name},
            {$push:
            {"userbids":MyBid}},
            {
              upsert:true
            }
         )
        res.send({status:"ok"})
    }
    catch(error){
        res.send({status:"error"})
        console.log(error);

    }
    

    
})



app.get("/allbids/getallhighest", async (req, res) => {
    const docs = await getAllHighestBids()
    res.json(docs) 
})

app.get("/allbids/getallhighestbidders", async (req, res) => {
    const docs = await getAllHighestBidders()
    res.json(docs) 
})

app.get("/mybids", async (req, res) => {
    const userName = req.query.name;
    const docs = await getMyBids(userName);
    res.json(docs) 
})