import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Book,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';
import axiosInstance from '../axiosInstance';

const ManageTest = () => {
  const [test, setTest] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
  });
  const [updateQuestionNo, setUpdateQuestionNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [level, setLevel] = useState('');
  const [sub, setSub] = useState('');
  const [chp, setChp] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'update'
  const [bulkQuestions, setBulkQuestions] = useState([]);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleDeleteQuestion = async (questionNo) => {
    if (!level || !sub || !chp) {
      showMessage('Please select level, subject and chapter', 'error');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this question?'
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/test/deleteQuestion`, {
        data: {
          testnum: String(level + sub + chp),
          questionNo: Number(questionNo),
        },
        ...config,
      });
      showMessage('Question deleted successfully', 'success');
      handleFetchTest(); // Re-fetch the test questions after deleting
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Error deleting question',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddQuestions = async () => {
    if (!level || !sub || !chp || bulkQuestions.length === 0) {
      showMessage(
        'Please select level, subject, chapter and add questions',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        '/test/addBulkQuestion',
        {
          testnum: String(level + sub + chp),
          questions: bulkQuestions,
        },
        config
      );
      showMessage('Bulk questions added successfully', 'success');
      setBulkQuestions([]);
      handleFetchTest();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Error adding bulk questions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTest = async () => {
    if (!level || !sub || !chp) {
      showMessage('Please select level, subject and chapter', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/test/getTest?testnum=${level + sub + chp}`,
        config
      );
      setTest(res.data.data);
      showMessage('Test loaded successfully', 'success');
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Error fetching test',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleAddQuestion = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axiosInstance.post(
        '/test/addQuestion',
        {
          testnum: String(level + sub + chp),
          question: newQuestion,
        },
        config
      );
      showMessage('Question added successfully', 'success');
      resetForm();
      handleFetchTest();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Error adding question',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!validateForm() || !updateQuestionNo) {
      showMessage('Please enter question number to update', 'error');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        '/test/updateQuestion',
        {
          testnum: String(level + sub + chp),
          questionNo: Number(updateQuestionNo),
          question: newQuestion,
        },
        config
      );
      showMessage('Question updated successfully', 'success');
      resetForm();
      handleFetchTest();
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Error updating question',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!level || !sub || !chp) {
      showMessage('Please select level, subject and chapter', 'error');
      return false;
    }

    if (!newQuestion.question.trim()) {
      showMessage('Question text cannot be empty', 'error');
      return false;
    }

    if (newQuestion.options.some((opt) => !opt.trim())) {
      showMessage('All options must be filled', 'error');
      return false;
    }

    if (!newQuestion.answer.trim()) {
      showMessage('Answer cannot be empty', 'error');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setNewQuestion({ question: '', options: ['', '', '', ''], answer: '' });
    setUpdateQuestionNo('');
  };

  const editQuestion = (q) => {
    setNewQuestion({
      question: q.question,
      options: [...q.options],
      answer: q.answer,
    });
    setUpdateQuestionNo(q.questionNo);
    setActiveTab('update');
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-5xl mx-auto px-4'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-8'>
            <h1 className='text-3xl font-bold text-white flex items-center'>
              <Book className='mr-3' />
              Manage Test Questions
            </h1>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`px-8 py-3 flex items-center ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {messageType === 'error' ? (
                <AlertCircle className='mr-2 h-5 w-5' />
              ) : (
                <CheckCircle className='mr-2 h-5 w-5' />
              )}
              <span className='font-medium'>{message}</span>
              <button onClick={() => setMessage('')} className='ml-auto'>
                <X className='h-4 w-4' />
              </button>
            </div>
          )}

          <div className='p-8'>
            {/* Selection Controls */}
            <div className='bg-gray-50 p-6 rounded-lg mb-8 shadow-sm'>
              <h2 className='text-xl font-semibold mb-4 text-gray-700 flex items-center'>
                <BookOpen className='mr-2' />
                Test Selection
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Level
                  </label>
                  <select
                    onChange={(e) => setLevel(e.target.value)}
                    className='w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                    value={level}
                  >
                    <option value='' disabled hidden>
                      Select Level
                    </option>
                    <option value='1'>Level 1</option>
                    <option value='2'>Level 2</option>
                    <option value='3'>Level 3</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Subject
                  </label>
                  <select
                    onChange={(e) => setSub(e.target.value)}
                    className='w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                    value={sub}
                  >
                    <option value='' disabled hidden>
                      Select Subject
                    </option>
                    {[...Array(11).keys()].map((num) => (
                      <option key={num} value={String(num)}>
                        Subject {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Chapter
                  </label>
                  <select
                    onChange={(e) => setChp(e.target.value)}
                    className='w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
                    value={chp}
                  >
                    <option value='' disabled hidden>
                      Select Chapter
                    </option>
                    {[...Array(12).keys()].map((num) => (
                      <option key={num} value={String(num)}>
                        Chapter {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='mt-6 flex justify-end'>
                <button
                  onClick={handleFetchTest}
                  disabled={loading}
                  className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center'
                >
                  {loading ? (
                    <div className='mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  ) : (
                    <Search className='mr-2 h-4 w-4' />
                  )}
                  Load Test
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowJsonModal(true)}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
            >
              Upload JSON
            </button>
            <button
              onClick={handleBulkAddQuestions}
              className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 mt-4'
            >
              Bulk Add Questions
            </button>

            {/* Display Test Questions */}
            {test && (
              <div className='mb-8'>
                <h2 className='text-xl font-semibold mb-4 text-gray-700'>
                  Current Test Questions
                </h2>
                <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                  {test.questions.length === 0 ? (
                    <div className='p-6 text-center text-gray-500'>
                      No questions available for this test.
                    </div>
                  ) : (
                    <div className='divide-y divide-gray-200'>
                      {test.questions.map((q) => (
                        <div
                          key={q.questionNo}
                          className='p-4 hover:bg-gray-50'
                        >
                          <div className='flex items-start justify-between'>
                            <div>
                              <h3 className='font-medium text-gray-900'>
                                <span className='text-blue-600 font-bold'>
                                  Q{q.questionNo}:
                                </span>{' '}
                                {q.question}
                              </h3>
                              <ul className='mt-2 ml-6 text-sm text-gray-600 list-disc'>
                                {q.options.map((option, idx) => (
                                  <li
                                    key={idx}
                                    className={
                                      option === q.answer
                                        ? 'font-semibold text-green-600'
                                        : ''
                                    }
                                  >
                                    {option}{' '}
                                    {option === q.answer && '(Correct Answer)'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <button
                                onClick={() => editQuestion(q)}
                                className='text-blue-600 hover:text-blue-800'
                              >
                                <Edit2 className='h-5 w-5' />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteQuestion(q.questionNo)
                                }
                                className='text-red-600 hover:text-red-800'
                              >
                                <Trash2 className='h-5 w-5' />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add/Update Question Form */}
            <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
              <div className='border-b border-gray-200'>
                <div className='flex'>
                  <button
                    onClick={() => setActiveTab('add')}
                    className={`px-6 py-3 font-medium ${
                      activeTab === 'add'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <div className='flex items-center'>
                      <Plus className='mr-2 h-4 w-4' />
                      Add New Question
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('update')}
                    className={`px-6 py-3 font-medium ${
                      activeTab === 'update'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <div className='flex items-center'>
                      <Edit2 className='mr-2 h-4 w-4' />
                      Update Question
                    </div>
                  </button>
                </div>
              </div>

              <div className='p-6'>
                <div className='space-y-4'>
                  {activeTab === 'update' && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Question Number to Update
                      </label>
                      <input
                        type='number'
                        placeholder='Question Number'
                        value={updateQuestionNo}
                        onChange={(e) => setUpdateQuestionNo(e.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Question Text
                    </label>
                    <textarea
                      placeholder='Enter your question here'
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question: e.target.value,
                        })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-20'
                      rows='3'
                    ></textarea>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {newQuestion.options.map((opt, i) => (
                      <div key={i}>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Option {i + 1}
                        </label>
                        <input
                          type='text'
                          placeholder={`Enter option ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newQuestion.options];
                            updated[i] = e.target.value;
                            setNewQuestion({
                              ...newQuestion,
                              options: updated,
                            });
                          }}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Correct Answer
                    </label>
                    <select
                      value={newQuestion.answer}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          answer: e.target.value,
                        })
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    >
                      <option value='' disabled>
                        Select Correct Answer
                      </option>
                      {newQuestion.options.map(
                        (opt, idx) =>
                          opt && (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          )
                      )}
                    </select>
                  </div>

                  <div className='pt-4 flex justify-end'>
                    <button
                      onClick={resetForm}
                      className='px-4 py-2 mr-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                    >
                      Clear Form
                    </button>

                    {activeTab === 'add' ? (
                      <button
                        onClick={handleAddQuestion}
                        disabled={loading}
                        className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center'
                      >
                        {loading ? (
                          <div className='mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <Plus className='mr-2 h-4 w-4' />
                        )}
                        Add Question
                      </button>
                    ) : (
                      <button
                        onClick={handleUpdateQuestion}
                        disabled={loading}
                        className='px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center'
                      >
                        {loading ? (
                          <div className='mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <Edit2 className='mr-2 h-4 w-4' />
                        )}
                        Update Question
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showJsonModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative'>
            <h2 className='text-lg font-semibold mb-4'>
              Upload Questions JSON
            </h2>
            <textarea
              rows='10'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your questions JSON array here'
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
            ></textarea>

            <div className='mt-4 flex justify-end space-x-3'>
              <button
                onClick={() => setShowJsonModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    if (!Array.isArray(parsed)) {
                      showMessage(
                        'JSON must be an array of questions',
                        'error'
                      );
                      return;
                    }
                    setBulkQuestions(parsed);
                    setShowJsonModal(false);
                    showMessage(
                      'Questions loaded. Click Bulk Add to submit.',
                      'success'
                    );
                  } catch (e) {
                    showMessage('Invalid JSON', 'error');
                  }
                }}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Load Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTest;
