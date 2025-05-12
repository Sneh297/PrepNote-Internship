const FlashCard = require('../models/FlashCard');
const sendResponse = require('../utils/sendResponce');

exports.getFlashCard = async (req, res) => {
  try {
    const { lscLevel } = req.query;
    if (!lscLevel) {
      return sendResponse(res, 400, false, 'Level,Subject,Chapter is required');
    }
    const flashCard = await FlashCard.findOne({ lscLevel });
    sendResponse(res, 200, true, 'FlashCard fetched successfully', flashCard);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.addFlashCard = async (req, res) => {
  try {
    const { lscLevel, Cards } = req.body;
    if (!lscLevel || !Cards || !Array.isArray(Cards)) {
      return sendResponse(
        res,
        400,
        false,
        'lscLevel and Cards (as array) are required'
      );
    }

    // Find the flashcard document by lscLevel
    const flashCard = await FlashCard.findOne({ lscLevel });

    const length = flashCard.Cards.length;
    for (let i = 0; i < Cards.length; i++) {
      Cards[i].cardNo = length + i + 1;
    }

    if (!flashCard) {
      return sendResponse(
        res,
        404,
        false,
        'FlashCard not found for the given lscLevel'
      );
    }

    // Add new cards to the existing Cards array
    flashCard.Cards.push(...Cards);
    await flashCard.save();

    sendResponse(res, 200, true, 'Cards added successfully', flashCard);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.updateFlashCard = async (req, res) => {
  try {
    const { lscLevel, cardNumber, updatedCard } = req.body;

    if (!lscLevel || !cardNumber || !updatedCard) {
      return sendResponse(
        res,
        400,
        false,
        'lscLevel, cardNo, and updatedCard are required'
      );
    }

    // Find the flashcard document by lscLevel
    const flashCard = await FlashCard.findOne({ lscLevel });

    if (!flashCard) {
      return sendResponse(
        res,
        404,
        false,
        'FlashCard not found for the given lscLevel'
      );
    }

    // Find the card with the given cardNo in the Cards array and update it
    const cardIndex = flashCard.Cards.findIndex(
      (card) => card.cardNo === cardNumber
    );

    if (cardIndex === -1) {
      return sendResponse(
        res,
        404,
        false,
        'Card with the given cardNo not found'
      );
    }

    // Update the specific card in the Cards array
    flashCard.Cards[cardIndex] = {
      ...flashCard.Cards[cardIndex],
      ...updatedCard,
    };

    await flashCard.save();

    sendResponse(res, 200, true, 'Card updated successfully', flashCard);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.deleteFlashCard = async (req, res) => {
  try {
    const { lscLevel, cardNo } = req.body;

    if (!lscLevel || !cardNo) {
      return sendResponse(res, 400, false, 'lscLevel and cardNo are required');
    }

    const flashCard = await FlashCard.findOne({ lscLevel });

    if (!flashCard) {
      return sendResponse(res, 404, false, 'FlashCard not found');
    }

    // Convert cardNo to number (since query params are strings)
    const cardNoToDelete = parseInt(cardNo);

    // Filter out the card to be deleted
    const originalLength = flashCard.Cards.length;
    if (originalLength === 0) {
      return sendResponse(res, 404, false, 'Card has no content');
    }
    flashCard.Cards = flashCard.Cards.filter(
      (card) => card.cardNo !== cardNoToDelete
    );

    if (flashCard.Cards.length === originalLength) {
      return sendResponse(res, 404, false, 'Card with given cardNo not found');
    }

    // Reassign cardNo for the remaining cards (starting from 1)
    flashCard.Cards = flashCard.Cards.map((card, index) => ({
      ...card.toObject(), // convert Mongoose subdoc to plain object
      cardNo: index + 1,
    }));

    await flashCard.save();

    sendResponse(res, 200, true, 'Card deleted successfully', flashCard);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};
