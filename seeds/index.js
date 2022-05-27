const mongoose = require('mongoose');
const path = require('path');
const cities = require('./cities');
const Campground = require(path.join(__dirname, '../models/campground.js'));
const Cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelpcamp');
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const rand = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/484351',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat perferendis maiores suscipit repellendus autem tenetur delectus, ex labore animi ab voluptatum in minima veritatis quia atque. Ut quaerat eum error. Nisi ab adipisci voluptatem perferendis recusandae dolorum expedita repellat itaque dignissimos. Voluptatibus itaque cum nobis eius! Unde, maiores saepe assumenda dignissimos totam illo laboriosam, esse veritatis beatae eos eum placeat!',
            price: Math.floor(Math.random()*20) + 10
        })
        await camp.save();
    }
    console.log('done');
}

seedDB()
.then((result) => {
    mongoose.connection.close()
}).catch((err) => {
    console.log(err);
});