/**
 * add-videos.js — Add YouTube video URLs to lessons
 * Run: node add-videos.js
 *
 * How to find a YouTube embed URL:
 *   1. Open any YouTube video
 *   2. Click Share → Embed
 *   3. Copy the src URL: https://www.youtube.com/embed/VIDEO_ID
 *   OR just use the watch URL: https://www.youtube.com/watch?v=VIDEO_ID
 *   OR the short URL:  https://youtu.be/VIDEO_ID
 *
 * The frontend automatically extracts the video ID from any of these formats.
 *
 * Set video_url to null to remove a video from a lesson.
 */

require('dotenv').config();
const sequelize = require('./src/config/database');
const Lesson = require('./src/modules/learning/lesson.model');

// ── VIDEO MAP ────────────────────────────────────────────────────────────────
// Key   = exact lesson title (must match DB exactly)
// Value = YouTube URL
// ─────────────────────────────────────────────────────────────────────────────
const VIDEO_MAP = {

  // ── Budgeting Basics ──────────────────────────────────────────────────────
  'What is a Budget?':
    'https://www.youtube.com/watch?v=sVKQn2I4HDM',

  'Tracking Your Expenses':
    'https://www.youtube.com/watch?v=HQzoZfc3GwQ',

  'Setting Financial Goals':
    'https://www.youtube.com/watch?v=_g_WxHuX3bw',

  // ── Building an Emergency Fund ────────────────────────────────────────────
  'Why You Need an Emergency Fund':
    'https://www.youtube.com/watch?v=vftTVbMFJ_Q',

  'Where to Keep Your Emergency Fund':
    'https://www.youtube.com/watch?v=3Ez0aBL4kgA',

  'Rebuilding After an Emergency':
    'https://www.youtube.com/watch?v=UtKnI0Bq2qg',

  // ── Understanding Loans ───────────────────────────────────────────────────
  'How Loans Work':
    'https://www.youtube.com/watch?v=ZSNL8-Qi9Cs',

  'Good Debt vs Bad Debt':
    'https://www.youtube.com/watch?v=xyGVPdRMozk',

  'Comparing Loan Offers':
    'https://www.youtube.com/watch?v=Qyh0ga9E5qs',

  // ── Getting Out of Debt ───────────────────────────────────────────────────
  'Mapping Your Debt':
    'https://www.youtube.com/watch?v=a_uqOiWRypU',

  'Debt Avalanche vs Debt Snowball':
    'https://www.youtube.com/watch?v=xEOHbCO-0mw',

  'Avoiding New Debt While Paying Off Old Debt':
    'https://www.youtube.com/watch?v=9H38Fz8_q4c',

  // ── Introduction to Investing ─────────────────────────────────────────────
  'Why Invest?':
    'https://www.youtube.com/watch?v=gFQNPmLKj1k',

  'Types of Investments':
    'https://www.youtube.com/watch?v=Ng7aSSMkQnw',

  'Starting Small — Investment Principles':
    'https://www.youtube.com/watch?v=r1PHBJ1XjB0',
};
// ─────────────────────────────────────────────────────────────────────────────

async function addVideos() {
  await sequelize.authenticate();
  console.log('✅ Database connected\n');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [title, url] of Object.entries(VIDEO_MAP)) {
    if (url && url.includes('REPLACE_ME')) {
      console.log(`⏭️  Skipped (placeholder): "${title}"`);
      skipped++;
      continue;
    }

    const lesson = await Lesson.findOne({ where: { title } });

    if (!lesson) {
      console.log(`❌ Not found in DB: "${title}"`);
      notFound++;
      continue;
    }

    await lesson.update({ video_url: url });
    console.log(`✅ Updated: "${title}"`);
    updated++;
  }

  console.log(`\n📊 Done — ${updated} updated, ${skipped} skipped, ${notFound} not found`);
  if (notFound > 0) {
    console.log('   Tip: lesson titles must exactly match what is in your database.');
    console.log('   Run: SELECT title FROM lessons;  to verify titles.');
  }

  await sequelize.close();
}

addVideos().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
