const mongoose = require('mongoose');
const FlashCard = require('./models/FlashCard');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/PrepNote', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    const lscLevels = [];

    // Generate test identifiers from the 3-nested loop
    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j <= 10; j++) {
        for (let k = 0; k <= 11; k++) {
          const testnum = `${i}${j}${k}`;
          lscLevels.push(testnum);
        }
      }
    }

    // Insert each lscLevel with empty Cards array
    for (let level of lscLevels) {
      const flashCard = new FlashCard({
        lscLevel: level,
        Cards: [],
      });
      await flashCard.save();
      console.log(`Inserted lscLevel: ${level}`);
    }

    console.log(`✅ Inserted ${lscLevels.length} flashcards.`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error connecting or inserting:', err);
  });
