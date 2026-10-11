
require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Prompt = require('./models/Prompt');

const DATA_FILE = path.join(
  __dirname,
  'data',
  'uzbek-prompts-100.json'
);

const API_URL = 'https://commons.wikimedia.org/w/api.php';

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

function cleanHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}


async function commonsRequest(params) {
  const url = new URL(API_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'UzbekPrompts/1.0 (prompt library)'
      }
    });

    if (response.status === 429) {
      if (attempt === 3) {
        const error = new Error(
          'Wikimedia limit reached. Please wait before retrying.'
        );
        error.status = 429;
        throw error;
      }

      const retryAfter = Number(
        response.headers.get('Retry-After')
      );

      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 15000 * (attempt + 1);

      console.log(
        `Wikimedia limit reached. Waiting ${Math.ceil(waitMs / 1000)} seconds...`
      );

      await sleep(waitMs);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Wikimedia API error: ${response.status}`);
    }

    return response.json();
  }
}



async function findImage(item) {
  const searches = [
    item.imageIdea,
    item.title
  ].filter(Boolean);

  for (const searchTerm of searches) {
    const result = await commonsRequest({
      action: 'query',
      format: 'json',
      list: 'search',
      srnamespace: '6',
      srlimit: '5',
      srsearch: searchTerm
    });

    const pages = result.query?.search || [];

    if (pages.length === 0) {
      await sleep(1500);
      continue;
    }

    // Fetch metadata for several files in one request.
    const details = await commonsRequest({
      action: 'query',
      format: 'json',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '900',
      titles: pages.map(page => page.title).join('|')
    });

    const imagePages = Object.values(
      details.query?.pages || {}
    );

    for (const imagePage of imagePages) {
      const info = imagePage.imageinfo?.[0];
      const meta = info?.extmetadata || {};

      if (!info?.thumburl || !info?.descriptionurl) {
        continue;
      }

      const license = cleanHtml(
        meta.LicenseShortName?.value || ''
      );

      const author = cleanHtml(
        meta.Attribution?.value ||
        meta.Artist?.value ||
        meta.Credit?.value ||
        ''
      );

      const allowed =
        /CC0|Public domain|CC BY(?:-SA)?(?:\s|$|-)/i.test(license);

      if (!allowed) continue;

      await sleep(1500);

      return {
        imageUrl: info.thumburl,
        imageSourceUrl: info.descriptionurl,
        imageAuthor: author,
        imageLicense: license
      };
    }

    await sleep(1500);
  }

  return null;
}


async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI backend/.env faylida topilmadi.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const parsed = JSON.parse(
  fs.readFileSync(DATA_FILE, 'utf8')
);

const prompts = Array.isArray(parsed)
  ? parsed
  : parsed.prompts;

if (!Array.isArray(prompts)) {
  throw new Error(
    'JSON ichidan promptlar massivi topilmadi. JSON tuzilishini tekshiring.'
  );
}

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of prompts) {
    // Keep existing images untouched.
    if (item.imageUrl) {
      skipped++;
      continue;
    }

    try {
      console.log(`Searching: ${item.title}`);

      const image = await findImage(item);

      if (!image) {
        console.log('Mos litsenziyali rasm topilmadi.');
        failed++;
        await sleep(500);
        continue;
      }

      item.imageUrl = image.imageUrl;
      item.imageSourceUrl = image.imageSourceUrl;
      item.imageAuthor = image.imageAuthor;
      item.imageLicense = image.imageLicense;

      // Update JSON so progress is not lost.
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(prompts, null, 2),
        'utf8'
      );

      // Update existing MongoDB prompt by title.
      await Prompt.updateOne(
        { title: item.title },
        {
          $set: {
            imageUrl: image.imageUrl,
            imageSourceUrl: image.imageSourceUrl,
            imageAuthor: image.imageAuthor,
            imageLicense: image.imageLicense
          }
        }
      );

      added++;

      console.log(`Rasm saqlandi: ${item.title}`);
      console.log(`Litsenziya: ${image.imageLicense}`);

      await sleep(700);
    } 
catch (error) {
  if (error.status === 429) {
    console.log(
      'Wikimedia limitiga yetildi. Skript to‘xtatildi; keyinroq davom ettiring.'
    );
    break;
  }

  failed++;
  console.error(
    `Xatolik (${item.title}):`,
    error.message
  );

  await sleep(2000);
}

  }

  console.log('\n--- NATIJA ---');
  console.log('Yangi rasmlar:', added);
  console.log('Avvaldan rasm bor:', skipped);
  console.log('Topilmagan yoki xatoli:', failed);
  console.log(
    'JSON fayldagi rasmsiz promptlar:',
    prompts.filter(item => !item.imageUrl).length
  );

  await mongoose.disconnect();
}

main().catch(async error => {
  console.error('Skript xatosi:', error);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
