const Yelp = require('./Yelp');
const yelp = new Yelp();

//Express
const express = require('express');
const app = express();
const PORT = 4700;
const server = app.listen(PORT, () => console.log(`LISTENING ON PORT: ${PORT}`));
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/get-leads', (req, res) => {
    res.json(yelp.leads);
});
app.post('/search', (req, res) => {
    console.log(req.body);
    const term = req.body.term;
    const loc = req.body.location;
    yelp.init(term, loc);
    yelp.findYelpPage();
    res.json({status: 1});
});
app.get('/app', (req, res) => {
    res.render('app');
})
app.get('/leads', (req, res) => {
    res.render('leads');
})

