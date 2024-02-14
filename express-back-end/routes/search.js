const express = require('express');
const router  = express.Router();
const searchQueries = require('../src/db/queries');

router.get('/advSearch', (req, res) => { // check conflicting? routes in gas-stations.js
  searchQueries.seachByCityFilterByPaymentMethod()
    .then(gasStn => {
      res.json({ gasStn });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;