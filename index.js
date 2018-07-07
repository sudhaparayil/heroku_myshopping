const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Item Model
const Item = require('./models/Item');
const app = express();
const path = require('path');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//middleweare
app.use(bodyParser.json());
app.use(fileUpload());
// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));




//image upload using express-fileupload
app.post('/upload', (req, res, next) => {
  console.log(req.files.file.name);
  let imageFile = req.files.file;

var imagename = Date.now()+'_'+req.files.file.name;

  imageFile.mv(`./client/src/upload/`+imagename, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    const newItem = new Item({
      name: req.body.name,
      filename: imagename,
    });
  
    newItem.save().then(item => res.json(item));
   
  });

})


// @route   GET api/items
// @desc    Get All Items
// @access  Public
app.get('/api/items', (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// @route   POST api/items
// @desc    Create An Item
// @access  Public
app.post('/api/item', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    Delete A Item
// @access  Public
app.delete('/:id', (req, res) => {
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(` listening on ${port}`);