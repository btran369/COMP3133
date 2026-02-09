const express = require('express');
const restaurantModel = require('../models/Restaurant');
const app = express.Router();

// Get all restaurants (with optional sorting)
// http://localhost:3000/restaurants
// http://localhost:3000/restaurants?sortBy=ASC
app.get('/restaurants', async (req, res) => {
    try {
        const { sortBy } = req.query;
        let query = restaurantModel.find({});

        if (sortBy) {
            // Specific columns and sorting
            const sortOrder = sortBy.toUpperCase() === 'DESC' ? -1 : 1;
            query = query
                .select('cuisine name city restaurant_id')
                .sort({ restaurant_id: sortOrder });
        }

        const restaurants = await query;
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Return all restaurant details by cuisine
// http://localhost:3000/restaurants/cuisine/:cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
    try {
        const cuisineName = req.params.cuisine;
        // Case-insensitive search using regex
        const restaurants = await restaurantModel.find({ 
            cuisine: { $regex: new RegExp(cuisineName, "i") } 
        });
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Test: Restaurants with cuisine 'Delicatessen' and city NOT 'Brooklyn'
// http://localhost:3000/restaurants/Delicatessen
app.get('/restaurants/Delicatessen', async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({
            cuisine: 'delicatessen',
            city: { $ne: 'brooklyn' }
        })
        .select('cuisine name city -_id') // Include specific columns, exclude _id
        .sort({ name: 1 }); // Ascending order by name

        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = app;
