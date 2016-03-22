const express = require('express');
const app = express();

app.use('/', express.static('static'));
app.use('/bower_components', express.static('bower_components'));

app.listen(3000, function () {
  console.log('Server running on port 3000.');
});
