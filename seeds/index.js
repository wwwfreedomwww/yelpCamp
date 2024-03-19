const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10

        // Make a GET request to Unsplash API to fetch a random image
        // const response = await axios.get('https://api.unsplash.com/photos/random', {
        //     params: {
        //         client_id: 'ZAUtYqsXtFtoFUZK0EXC1lOABDvjgS3MI781S3bN3uo', 
        //         collections: 'XRWoial1tf4'
        //     }
        // });

        // const imageUrl = response.data.urls.regular;
        const camp = new Campground({
            author: '65f4635f5ba608e20e63ee8c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dzuf1m282/image/upload/v1710757853/YelpCamp/image_gehcfq.jpg',
                    filename: 'YelpCamp/mjusca5mdcoemaiix7lc'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})