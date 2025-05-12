const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const checkAdmin = require('../utils/checkAdmin');

router.get('/getTest', testController.getTest);
router.post('/addQuestion', checkAdmin, testController.addQuestion);
router.put('/updateQuestion', checkAdmin, testController.updateQuestion);
router.post('/addBulkQuestion', checkAdmin, testController.bulkAdd);
router.delete('/deleteQuestion', checkAdmin, testController.deleteQuestion);
module.exports = router;
