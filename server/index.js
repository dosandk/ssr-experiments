const express = require('express');
const morgan = require('morgan');
const port = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');

const {ssr, buttonComponent} = require('../client/index');

const getIndexFile = () =>
  new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../index.html'), 'utf8', (err, data) => {
      return err ? reject() : resolve(data);
    });
  });

app.use(morgan('dev'));
app.use('/client', express.static(path.resolve(__dirname, '../client')));

getIndexFile()
  .then(data => {
    const content = ssr.renderToString(buttonComponent());
    const response = data
      .replace('<div id="root"></div>', `<div id="root" class="root">${content}</div>`);

    app.get('/*', (req, res) => {
      return res.send(response);
    });

    app.listen(port, error => {
      if (error) {
        console.error(`Error: ${error}`);
      }

      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('error', error);
  });
