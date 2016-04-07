const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);

app.use('/', express.static('static'));
app.use('/bower_components', express.static('bower_components'));

app.listen(port, function () {
  console.log('Server running on port 3000.');
});
