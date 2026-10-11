require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Prompt = require('./models/Prompt');

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI topilmadi. backend/.env faylini tekshir.');
  }

  const filePath = path.join(
    __dirname,
    'data',
    'uzbek-prompts-100.json'
  );

  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  await mongoose.connect(process.env.MONGODB_URI);

  let inserted = 0;
  let skipped = 0;

  try {
    for (const item of data.prompts) {
      const exists = await Prompt.findOne({
        title: item.title
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Prompt.create({
        title: item.title,
        prompt: item.prompt,
        description: item.description,
        type: item.type || 'image',
        category: item.category,
        imageUrl: item.imageUrl || '',
        approved: true
      });

      inserted++;
      console.log('Added:', item.title);
    }

    console.log('\nImport completed!');
    console.log('Added:', inserted);
    console.log('Skipped:', skipped);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(error => {
  console.error('Import error:', error.message);
  process.exitCode = 1;
});
