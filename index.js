// Daniel Wait Website

// brings in the library
let express = require("express");

// makes an express object
let app = express();

// brings in the library
let path = require("path");

// sets the port variable to 4000
const port = process.env.PORT || 4000;

// sets the view engine is ejs
app.set("view engine", "ejs");

// tells where the views is the directory for the ejs files
app.set("views", path.join(__dirname, "views"));

// lets you access the body of the request
// get  is req.query.name    req.perams.name
// post is req.body.name
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/consulting', (req, res) => {
    res.render('consulting');
});


app.get('/contact', (req, res) => {
    res.render('contact');
});


app.get('/projects', (req, res) => {
    res.render('projects');
});


app.get('/resume', (req, res) => {
    res.render('resume');
});





// ALWAYS AT THE BOTTOM
app.listen(port, () => console.log('Listening on port ', {port}));