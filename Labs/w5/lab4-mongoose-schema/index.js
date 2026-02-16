const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/UserRoutes.js');
const SERVER_PORT = process.env.PORT || 8081;

const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here
const DB_NAME = "db_user"
const DB_USER_NAME = 'billtran2003_db_user'
const DB_PASSWORD = 'bHaJEH1y5nk4ovBi'
const CLUSTER_ID = 'ik3zeue'
const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
// const DB_CONNECTION = 'mongodb+srv://billtran2003_db_user:bHaJEH1y5nk4ovBi@cluster0.ik3zeue.mongodb.net/$db_user?retryWrites=true&w=majority&appName=Cluster0';

console.log("Starting Server")

mongoose.connect(DB_CONNECTION).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.use(userRouter);

app.listen(SERVER_PORT, () => { console.log('Server is running...') });