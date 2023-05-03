const express = require('express');
const app = express();
const router = express.Router();
const ejs = require('ejs');
const { scraping } = require('./controller/scrapingController');

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');


app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/scraping', scraping);
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.status(404).render('404');
    next();
});


const port = process.env.PORT || 8000;

app.listen(port, (req, res) => {
    console.log('Servidor funcionando')
})
