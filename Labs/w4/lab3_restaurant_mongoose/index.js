const express = require('express');
const mongoose = require('mongoose');
const restaurantRouter = require('./routes/RestaurantRoutes.js');
const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // Make sure it comes back as json

//TODO - Replace you Connection String here
// const DB_NAME = "db_restaurants"
// const DB_USER_NAME = 'billtran2003_db_user'
// const DB_PASSWORD = 'mTwdKxW4zZSH5nQP'
// const CLUSTER_ID = 'e7kcfir'
// const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@cluster0.${CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
const DB_CONNECTION = 'mongodb+srv://billtran2003_db_user:mTwdKxW4zZSH5nQP@cluster0.e7kcfir.mongodb.net/?appName=Cluster0';

mongoose.connect(DB_CONNECTION).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.use(restaurantRouter);

app.listen(SERVER_PORT, () => { console.log('Server is running...') });