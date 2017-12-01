const express = require('express');
const hbs = require('hbs')
const fs = require('fs')

var app = express();

const isMaintenance = false;

// To make nodemon watch for changes in hbs files, use the following command:
// nodemon .\server.js -e js,hbs

// Add middleware with app.use(...)
// Middleware is executed in the order it is registered
// Available as 'http://localhost:3000/help.html'
app.use((req, res, next) => {
    // middleware code (request-><middleware_code>->response)
    // manipulate over req and res arguments: res.render('maintenance_page.html')

    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', `${log}\n`, err => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    // call next() to move to next piece of middleware
    // or do not call to do nothing
    next();
})

app.use((req, res, next) => {
    if (isMaintenance) {
        res.render('maintenance.hbs', {
            pageTitle: 'We\'ll me right back',
            message: 'The site is currently being updated.'
        });
    } else {
        next();
    }
})

// declare directory with static files we can serve
app.use(express.static(`${__dirname}/public`));
// Available as 'http://localhost:3000/help.html'


// Add supprot for hbs 'partials'
hbs.registerPartials(`${__dirname}/views/partials`);
// Configure Template (View) Engine (like razor in ASP.NET or Thymeleaf in Spring) to be 'hbs'
app.set('view engine', 'hbs');

// Register hbs helper to be used in templates
hbs.registerHelper('getCurrentYear', () => {
    // This function will be called each time it's referenced in .hbs file
    // as {{getCurrentYear}}
    return new Date().getFullYear();
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})


// Register a handler for an http get request
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!'
    });
});

app.get('/date', (req, res) => {
    res.send(`Current time is: ${new Date()}`)
});

app.get('/bad', (req, res) => {
    // send BadRequest status code along with error message
    res.statusCode = 400;
    res.send({
        errorMessage: 'Unable to handle request'
    })
});

app.get('/about', (req, res) => {
    // render a template from view engine
    res.render('about.hbs', {
        // data for the template
        pageTitle: 'About Page'
    });
});

app.listen(3000, () => {
    // callback function when server is started
    console.log('Server is up on port 3000')
}); // http://localhost:3000/