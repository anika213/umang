const express = require('express');
const cors = require('cors');

const { RateLimiterMemory } = require('rate-limiter-flexible');
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
require('dotenv').config();
const mongoose = require("mongoose");
const stream = require('stream');

const axios= require("axios");
const { getApp } = require('firebase-admin/app');
const { reset } = require('nodemon');
const app = express();
const router = express.Router()


const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
const database = client.db(process.env.DATABASE_NAME);
const users = database.collection('users');
const paintings = database.collection('paintings');
const paintingbids = database.collection('paintingbids');
const imagechunks = database.collection('images.chunks');
const imagefiles = database.collection('images.files');

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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


getimages = async (paintingnumber) => {
    const painting = await collection.findOne({ paintingnumber: paintingnumber });
  
    // Check if painting exists and has an image field
    if (painting && painting.image) {
      // Return the URL to access the image
      return `http://localhost:8080/image/${painting.image}`;
    } else {
      console.log(`Painting with number ${paintingnumber} not found or doesn't have an image.`);
      return null;
    }
  };
  

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


resetAuction = async () => {
  // Delete all users except the one with username "Minimum Bid"
  await users.deleteMany({ username: { $ne: "Minimum Bid" } });

  // Clear paintings collection
  await paintings.deleteMany({});
  await paintingbids.deleteMany({});
  await imagefiles.deleteMany({});
  await imagechunks.deleteMany({});

  // Uncomment the following lines if you also want to delete image files and chunks
  // await images.files.deleteMany({});
  // await images.chunks.deleteMany({});
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
app.put("/admin/deletepainting", async (req, res) => {
  const{paintingnumber} = req.body;
  console.log(paintingnumber)
  paintings.deleteOne({"painting":paintingnumber})
  res.status(200).send("ok");
})

app.put("/admin/loadinfo", async (req, res) => {
  const { paintingnumber } = req.body;
  console.log(paintingnumber);
  
  try {
    const info = await paintings.findOne({ "painting": paintingnumber });
    if (info) {
      res.json({ info: info });
    } else {
      res.status(404).json({ message: 'Painting not found' });
    }
  } catch (error) {
    console.error("Error fetching painting information:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



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



app.put("/admin/viewhistory",  async (req, res) => {

  try{
      const {paintingnumber} = req.body
      console.log(paintingnumber)
      const history = await paintingbids.findOne({"painting":paintingnumber})
      res.send(history.bids)
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

         paintingbids.updateOne(
          {"painting":paintingnumber},
          {$push:{
          "bids":updatedVal}},
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

app.get("/resetauction", async (req, res) => {
 resetAuction();
 res.status(200).send("ok");
})

app.get("/image/:id", async (req, res) => {
  try {
    const bucket = new GridFSBucket(client.db('testdatabase'), { bucketName: 'images' });
    const downloadStream = bucket.openDownloadStream(new MongoClient.ObjectID(req.params.id));
    downloadStream.pipe(res);
  } catch (error) {
    res.status(404).send("Image not found");
  }
});


app.put("/admin/addpainting", async (req, res) => {
  try {
    const { title, artist, description, medium, minBid, styling, image, paintingnum } = req.body;

    // Create HighestBid object
    const HighestBid = {
      "bidder": "Minimum Bid",
      "bidvalue": minBid
    };

    // Check if painting with the title already exists
    const allinfo = await paintings.find({}, { projection: { "_id": 0, "painting": 1, "title": 1 } }).toArray();
    const accTitle = title +" by "+ artist;
    console.log("PAINTINGNUM"+paintingnum)
    if(paintingnum!=""){
    // const paintingExists = allinfo.some(item => item.title === accTitle);
      const paintingInfo = await paintings.findOne({ "painting": paintingnum });
      if (!paintingInfo) {
        return res.status(404).send("Painting not found");
      }
      console.log("acc"+accTitle)
      await paintings.updateOne(
        { painting: paintingnum },
        { $set: {
          "title": accTitle,
          "description": description,
          "medium": medium,
          "size": styling
        }}
      );
      // Add code here to update the image if needed
      res.status(200).send("Updated existing painting");

    } else { // ADD NEW PAINTING
      // Logic for generating new painting number remains the same
       // Create an array of just the "painting" fields
      const paintingArray = allinfo.map(item => item.painting);

      const numericParts = paintingArray.map(paintingNumber => parseInt(paintingNumber.replace('painting', '')));
      let highestValue = Math.max(...numericParts);
      if(highestValue == -Infinity){
            highestValue = 0;
      }
      const newPaintingNumber = `painting${highestValue + 1}`;

      // insert new painting
      await paintings.insertOne({
        "painting": newPaintingNumber,
        "title": accTitle,
        "description": description,
        "medium": medium,
        "highestBid": HighestBid,
        "size": styling,
        "notes":[]
      });
      await paintingbids.insertOne({
        "painting": newPaintingNumber,
        "bids": [],
      });
      const imageBase64 = req.body.image.split(',')[1];  // Assuming image is sent as Data URL
      const buffer = Buffer.from(imageBase64, 'base64');
      const readableStream = new stream.Readable();
      readableStream.push(buffer);
      readableStream.push(null);  // Indicates EOF
      
      const bucket = new GridFSBucket(client.db('testdatabase'), { bucketName: 'images' });
      const uploadStream = bucket.openUploadStream(accTitle);  
      
      readableStream.pipe(uploadStream);
      
      uploadStream.on('finish', async (file) => {
       await paintings.updateOne(
         { painting: newPaintingNumber },
         { $set: { image: ObjectId(file._id.toString())} }
       );
       res.status(200).send("ok");
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/image", async (req, res) => {
  try {
    const paintingnumber = req.query.paintingnumber;
    console.log("Requested painting number:", paintingnumber);  // Debug log

    const paintingInfo = await paintings.findOne({ painting: paintingnumber });
    console.log("Found painting info:", paintingInfo);  // Debug log

    if (!paintingInfo || !paintingInfo.image) {
      return res.status(404).send("Image not found");
    }

    const imageId = paintingInfo.image.toString(); // Converting ObjectId to string
    console.log("Found image ID:", imageId);  // Debug log

    const bucket = new GridFSBucket(client.db('testdatabase'), { bucketName: 'images' });
    const downloadStream = bucket.openDownloadStream(new ObjectId(imageId));

    downloadStream.pipe(res);

  } catch (error) {
    console.log("Error:", error);  // Debug log
    res.status(404).send("Image not found");
  }
});




app.get("/checkifbiddingdone", async (req, res) => {

  // check whether there is a document in the users database with username "I-INDIA-ADMIN"
  const check = await users.find({"username":"Minimum Bid"}).toArray();
  // console.log(check)
  if(check.length>0 && check[0].endBidding==true){
    res.send({status:true})
  }
  else{
    res.send({status:false})
  }

});

app.get('/admin/endbidding', async (req, res) => {
  // add a document in the users database
  // find document in users with username Minimum Bid
  let admin = await users.findOne({"username":"Minimum Bid"});
  console.log(admin)
  if(admin.endBidding==true){
    await users.updateOne(
      { "username": "Minimum Bid" },
      { $set: { "endBidding": false } }
    );
  }

  else{
    await users.updateOne(
      { "username": "Minimum Bid" },
      { $set: { "endBidding": true } }
    );

  }

  console.log("ended")
  res.status(200).send("ok");


});


  app.get('/paintinginfo', async (req, res) => {
    // get all information about each painting in the database
    const allinfo = await paintings.find().toArray();
    
    var paintingsTitles = {};
    var paintingsDescriptions = {};
    var paintingsMediums = {};
    var paintingsSizes = {};
    var paintingsHighestBids = {};
    var imageUrls = {};
    
    // Loop through each painting to extract information
    allinfo.forEach((paintingInfo) => {
      const paintingName = paintingInfo.painting;
      paintingsTitles[paintingName] = paintingInfo.title || 'N/A';
      paintingsDescriptions[paintingName] = paintingInfo.description || 'N/A';
      paintingsMediums[paintingName] = paintingInfo.medium || 'N/A';
      paintingsSizes[paintingName] = paintingInfo.size || 'N/A';
      paintingsHighestBids[paintingName] = paintingInfo.highestBid ? paintingInfo.highestBid.bidvalue : 'N/A';
      imageUrls[paintingName] = `http://localhost:8000/image?paintingnumber=${paintingName}`;
    });
    console.log(imageUrls)  
    res.status(200).json({
      titles: paintingsTitles,
      descriptions: paintingsDescriptions,
      mediums: paintingsMediums,
      sizes: paintingsSizes,
      highestBids: paintingsHighestBids,
      images: imageUrls,
    });
  });
  