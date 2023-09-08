require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const Fruit = require('./models/fruit');
const Vegetable = require("./models/vegetable")
const mongoose = require("mongoose")

//DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
});
//////////////////////////

const jsxViewEngine = require('jsx-view-engine');

app.set('view engine', 'jsx');
app.set('views', './views');
app.engine('jsx', jsxViewEngine());

//Middleware
app.use((req, res, next) => {
  console.log('Middleware: I run for all routes, 1');
  next();
});
// By implementing the line below, we now have access to the req.body. Which is the parsed formData from the form request.
app.use(express.urlencoded({ extended: false }));

// Index Route Fruit
app.get('/fruits', async (req, res) => {
  try {
    //leaving .find empty means there's no filter applied to the search
    const foundFruits = await Fruit.find({})
    //it always returns an array, even if it's empty, it will return an empty array
    //PLURAL FRUITS! because we are looking for the key of FRUITS not FRUIT
    res.status(201).render("fruits/Index", { fruits: foundFruits })
  } catch (err) {
    res.status(400).send(err)
  }
  console.log()
});

//Vegetable Index route
app.get('/vegetables', async (req, res) => {
  try {
    //leaving .find empty means there's no filter applied to the search
    const foundVegetables = await Vegetable.find({})
    //it always returns an array, even if it's empty, it will return an empty array
    //PLURAL FRUITS! because we are looking for the key of FRUITS not FRUIT
    res.status(201).render("vegetables/Index", { vegetables: foundVegetables })
  } catch (err) {
    res.status(400).send(err)
  }
  console.log()
});

//Fruit New
// New
app.get('/fruits/new', (req, res) => {
  res.render('fruits/New');
});

//Vegetables NEW
app.get("/vegetables/new", (req, res) => {
  res.render("vegetables/NewVeg")
})

//DELETE

//UPDATE

//Fruit Create/POST
app.post('/fruits', async (req, res) => {
  try {
    // if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
    //   req.body.readyToEat = true; //do some data correction
    // } else { //if not checked, req.body.readyToEat is undefined
    //   req.body.readyToEat = false; //do some data correction
    // }
    req.body.readyToEat = req.body.readyToEat === 'on';

    const createdFruit = await Fruit.create(req.body);

    res.status(201).redirect("/fruits")
  } catch (err) {
    res.status(400).send(err)
  }
});

//Vegetable Create/POST
app.post('/vegetables', async (req, res) => {
  try {
    // if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
    //   req.body.readyToEat = true; //do some data correction
    // } else { //if not checked, req.body.readyToEat is undefined
    //   req.body.readyToEat = false; //do some data correction
    // }
    req.body.readyToEat = req.body.readyToEat === 'on';

    const createdVegetables = await Vegetable.create(req.body);

    res.status(201).redirect("/fruits")
  } catch (err) {
    res.status(400).send(err)
  }
});

//EDIT


//Fruit show Route
app.get('/fruits/:id', async (req, res) => {
  try {
    //references ID in URL bar
    const foundFruit = await Fruit.findById(req.params.id)

    res.render("fruits/Show", {
      fruit: foundFruit
    })
  } catch (err){
    res.status(400).send(err)
  }
});

//Vegetable Show route
app.get("/vegetables/:id", (req, res) => {
  res.render("vegetables/ShowVegetable", {vegetable: vegetables[req.params.id]})

})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});