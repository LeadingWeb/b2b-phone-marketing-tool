const Yelp = require('./Yelp');

//Express
const express = require('express');
const app = express();
const PORT = 4000;
const server = app.listen(PORT, () => console.log(`LISTENING ON PORT: ${PORT}`));
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

const yelp = new Yelp();
yelp.init('test', 'test');