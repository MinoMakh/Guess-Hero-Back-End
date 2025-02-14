const express = require('express');
const heroController = require('../controllers/heroController');

const router = express.Router();
router.get('/getHeros', heroController.getTodayHeros);

router.get('/getNames', heroController.getNames);

module.exports = router;