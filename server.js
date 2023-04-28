const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const port = 4000;

require("dotenv").config({ path: "./config.env" });

//mongodb
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URI = process.env.MONGO_URI;

const conn = require("./db/connection");

//api check
app.get("/", (req, res) => {
  res.send("Hall Booking API check 🎉🎉");
});

//creating a room
app.post("/api/rooms/create", async (req, res) => {
  try {
    //connect mongodb
    const connection = await mongoClient.connect(URI);
    //select DB
    const db = connection.db("hallbook");
    //select collection
    const collection = db.collection("rooms");
    //insert data
    const operation = await collection.insertMany(req.body);
    //close the connection
    connection.close();
    res.json({ message: "Rooms Created" });
    console.log("Rooms Created");
  } catch (error) {
    console.log(error);
    res.status(500).json({ messagae: "Something Went Wrong" });
  }
});

//get room details
app.get("/api/room/details", async (req, res) => {
  try {
    //connect mongodb
    const connection = await mongoClient.connect(URI);
    //select DB
    const db = connection.db("hallbook");
    //select collection
    const collection = db.collection("rooms");
    //insert data
    const roomdetails = await collection.find({}).toArray();
    //close the connection
    connection.close();
    res.json(roomdetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messagae: "Something Went Wrong" });
  }
});

//Booking room with Id
app.post("/api/booking/:id", async (req, res) => {
  try {
    //connect mongodb
    const connection = await mongoClient.connect(URI);
    //select DB
    const db = connection.db("hallbook");
    //select collection
    const collection = db.collection("bookingdetails");
    const collection1 = db.collection("rooms");
    const data = await collection1
      .find({ _id: new mongodb.ObjectId(req.params.id) })
      .toArray();

    if (data[0].isbooked) {
      res.json({ message: "Hall is not available" });
    } else {
      //update booking  data
      const op1 = await collection1.findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: { isbooked: true } }
      );
      //insert data
      const operation = await collection.insertOne({
        ...req.body,
        isbooked: true,
      });
      //close the connection
      connection.close();
      res.json({ message: "Room Booked" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

//get customer details
app.get("/api/customers", async (req, res) => {
  try {
    //connect mongodb
    const connection = await mongoClient.connect(URI);
    //select DB
    const db = connection.db("hallbook");
    //select collection
    const collection = db.collection("bookingdetails");
    //insert data
    const customers = await collection.find({}).toArray();
    //close the connection
    connection.close();
    res.json(customers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messagae: "Something Went Wrong" });
  }
});

conn
  .then((db) => {
    if (!db) return process.exit(1);

    app.listen(port, () => {
      console.log(`Server is running on port http://localhost/${port}`);
    });

    app.on("error", (error) => {
      console.log(`Failed to connect with HTTP server : ${error}`);
    });
  })
  .catch((error) => {
    console.log(`Connection Failed...!${error}`);
  });
