const express = require('express');
const app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(3000);
console.log('getting it done on port 3000');
