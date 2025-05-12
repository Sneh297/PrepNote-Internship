const express = require('express');
const router = express.Router();
const flashCardController = require('../controllers/flashCardController');
const checkAdmin = require('../utils/checkAdmin');

router.get('/getFlashCard', flashCardController.getFlashCard);
router.post('/addFlashCard', checkAdmin, flashCardController.addFlashCard);
router.put('/updateFlashCard', checkAdmin, flashCardController.updateFlashCard);
router.delete(
  '/deleteFlashCard',
  checkAdmin,
  flashCardController.deleteFlashCard
);
module.exports = router;
