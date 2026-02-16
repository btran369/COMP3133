const express = require('express')
const userModel = require('../models/User')
const app = express()

app.post('/users', async (req, res) => {

    console.log(req.body)

    try {

        const users = await userModel.insertMany(req.body);

        res.status(201).send(users);

    } catch (err) {
        res.status(500).send(err);
    }

});

app.get('/users', async (req, res) => {
    console.log(req.body)
    const users = await userModel.find({});

    try {
        console.log(users[0].username)
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = app