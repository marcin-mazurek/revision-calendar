const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);

app.get('/config.js', (req, res) => {
  const config = {
    clientId: process.env.CLIENT_ID || null,
    days: process.env.DAYS ? process.env.DAYS.split(',') : [3, 10, 30, 60]
  };

  res.send(`const config = ${JSON.stringify(config)};`);
});
app.use('/', express.static('static'));
app.use('/bower_components', express.static('bower_components'));

app.listen(port, function () {
  console.log('Server running on port 3000.');
});
