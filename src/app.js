const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine views location
// Diz ao express (seta uma propriedade) qual engine de template vamos usar
// O expresse vai procurar um arquivo na pasta views (default)
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    // render permite renderizar uma view (no caso, handlebar)
    res.render('index', {
        title: 'Weather App',
        name: 'Daniel Albin'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Daniel Albin'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Daniel Albin'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.adress) {
        return res.send({
            error: 'Please, provide an adress'
        })
    }

    geocode(req.query.adress, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        };

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            };

            res.send({
                forecast: forecastData,
                location,
                adress: req.query.adress
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        // Retornar a resposta evita chamar send duas vezes
        return res.send({
            error: 'You must provide a search term'
        })
    };

    console.log(req.query);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found'
    });
});

// 404 page
// Tem que ser o último, pois o express busca um match, se não achar, usa o wild card *
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000')
});