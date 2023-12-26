const express = require('express')
const app = express();
const fs = require('fs');
let tokens = JSON.parse(fs.readFileSync('app-key.json'));
const port = process.env.PORT || 3000;


// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/', (req, res) => {
  res.send( tokens);
});

app.get('/validate', (req, res) => {
  res.status(200).send({msg: 'Token is valid'});/*
  if(!req.query.token) {
    res.status(400).send({msg: 'token not found'});
  } else if(tokens[req.query.token]) {
    res.status(200).send({msg: 'Token is valid'});
  } else if (!tokens[req.query.token]) {
    res.status(403).send({msg: 'Token is invalid'});
  }*/
});

app.get('/consume', (req, res) => {
  if(!req.query.token) {
    res.status(400).send({msg: 'token not found'});
  } else if(tokens[req.query.token]) {
    tokens[req.query.token] = false;
    let data = JSON.stringify(tokens, null, 2);

    fs.writeFile('app-key.json', data, (err) => {
      if (err) throw err;
      res.status(200).send({msg: 'Token consumed'});
  });

  } else if (!tokens[req.query.token]) {
    res.status(403).send({msg: 'Token is invalid'});
  }
});

function makeid(length) {
  var result          = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
charactersLength));
 }
 return result;
}

const randomProperty = function (obj) {
  var keys = Object.keys(obj).filter(key => !!obj[key]);
  return keys[ keys.length * Math.random() << 0];
};

app.get('/generate-tokens', (req, res) => {
  const newTokens = {};
  for(let i=0; i<100000; i++) {
    newTokens[makeid(4)] = true;
  }
  let data = JSON.stringify(newTokens, null, 2);
  fs.writeFile('app-key.json', data, (err) => {
    if (err) throw err;
    res.status(200).send({msg: 'Tokens generated'});
});

});

app.get('/get-token', (req, res) => {

  res.status(200).send(randomProperty(tokens));
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})