const Test = require('../models/Test');
const sendResponse = require('../utils/sendResponce');

exports.getTest = async (req, res) => {
  try {
    const { testnum } = req.query;
    if (!testnum) {
      return sendResponse(res, 400, false, 'Test number is required');
    }
    const test = await Test.findOne({ testnum });
    sendResponse(res, 200, true, 'Test fetched successfully', test);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { testnum, question } = req.body;

    if (
      !testnum ||
      !question ||
      !question.question ||
      !Array.isArray(question.options) ||
      !question.answer
    ) {
      return sendResponse(res, 400, false, 'Missing required question fields');
    }

    const test = await Test.findOne({ testnum });

    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }
    const questionNo = test.questions.length + 1;
    const newQuestion = {
      questionNo,
      question: question.question,
      options: question.options,
      answer: question.answer,
    };

    test.questions.push(newQuestion);
    await test.save();

    sendResponse(res, 200, true, 'Question added successfully', newQuestion);
  } catch (error) {
    console.error('Add Question Error:', error.message);
    sendResponse(res, 500, false, 'Server Error');
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    const { testnum, question, questionNo } = req.body;

    if (
      !testnum ||
      !question ||
      typeof questionNo !== 'number' ||
      !question.question ||
      !Array.isArray(question.options) ||
      !question.answer
    ) {
      return sendResponse(
        res,
        400,
        false,
        'Missing or invalid question fields'
      );
    }

    const test = await Test.findOne({ testnum });

    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }

    // Find the index of the question to update
    const index = test.questions.findIndex((q) => q.questionNo === questionNo);

    if (index === -1) {
      return sendResponse(res, 404, false, `Question ${questionNo} not found`);
    }

    // Update the existing question
    test.questions[index] = {
      questionNo,
      question: question.question,
      options: question.options,
      answer: question.answer,
    };

    await test.save();

    sendResponse(
      res,
      200,
      true,
      'Question updated successfully',
      test.questions[index]
    );
  } catch (error) {
    console.error('Update Question Error:', error.message);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.bulkAdd = async (req, res) => {
  try {
    const { testnum, questions } = req.body;
    if (!testnum || !Array.isArray(questions)) {
      return sendResponse(res, 400, false, 'Invalid request body');
    }
    const test = await Test.findOne({ testnum });
    if (!test) {
      return sendResponse(res, 404, false, 'Test not found');
    }

    const questionLength = test.questions.length;
    for (let i = 0; i < questions.length; i++) {
      questions[i].questionNo = questionLength + i + 1;
    }

    test.questions.push(...questions);
    await test.save();
    sendResponse(res, 200, true, 'Questions added successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { testnum, questionNo } = req.body;

    if (!testnum || !questionNo) {
      return res.status(400).json({
        success: false,
        message: 'Test number and question number are required',
      });
    }

    // Find the test by testnum
    const test = await Test.findOne({ testnum });
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: 'Test not found' });
    }

    // Find the question by questionNo and remove it
    const questionIndex = test.questions.findIndex(
      (q) => q.questionNo === questionNo
    );

    if (questionIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Question not found' });
    }

    // Remove the question
    test.questions.splice(questionIndex, 1);

    for (let i = questionIndex; i < test.questions.length; i++) {
      test.questions[i].questionNo--;
    }

    await test.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
