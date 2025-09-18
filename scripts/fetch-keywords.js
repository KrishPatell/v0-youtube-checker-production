#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Ahrefs API integration
async function fetchAhrefsKeywords() {
  const ahrefsApiKey = process.env.AHREFS_API_KEY;
  if (!ahrefsApiKey) {
    throw new Error('AHREFS_API_KEY not configured');
  }

  console.log('🔍 Fetching keywords from Ahrefs API...');

  const response = await fetch('https://apiv2.ahrefs.com', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ahrefsApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: 'youtube.com',
      mode: 'subdomains',
      limit: 100,
      order_by: 'search_volume:desc',
      where: 'search_volume > 1000 AND keyword_difficulty < 30'
    })
  });

  if (!response.ok) {
    throw new Error(`Ahrefs API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Fetched ${data.keywords?.length || 0} keywords from Ahrefs`);

  return data;
}

// Save keywords to file
async function saveKeywords(keywords) {
  const dataDir = path.join(process.cwd(), 'data');
  const keywordsFile = path.join(dataDir, 'keywords.json');

  // Ensure data directory exists
  await fs.mkdir(dataDir, { recursive: true });

  // Load existing keywords
  let existingKeywords = [];
  try {
    const existingData = await fs.readFile(keywordsFile, 'utf8');
    existingKeywords = JSON.parse(existingData);
  } catch (error) {
    console.log('📝 Creating new keywords file...');
  }

  // Merge with new keywords
  const newKeywords = keywords.keywords || [];
  const mergedKeywords = [...existingKeywords];

  newKeywords.forEach(newKeyword => {
    const exists = mergedKeywords.some(existing => existing.keyword === newKeyword.keyword);
    if (!exists) {
      mergedKeywords.push({
        ...newKeyword,
        created_at: new Date().toISOString(),
        used: false
      });
    }
  });

  // Sort by search volume
  mergedKeywords.sort((a, b) => b.search_volume - a.search_volume);

  // Save to file
  await fs.writeFile(keywordsFile, JSON.stringify(mergedKeywords, null, 2));
  console.log(`💾 Saved ${mergedKeywords.length} keywords to ${keywordsFile}`);

  return mergedKeywords;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting keyword fetch process...');
    
    const keywords = await fetchAhrefsKeywords();
    const savedKeywords = await saveKeywords(keywords);
    
    console.log('✅ Keyword fetch process completed successfully!');
    console.log(`📊 Total keywords: ${savedKeywords.length}`);
    console.log(`🔥 Top 5 keywords by search volume:`);
    
    savedKeywords.slice(0, 5).forEach((keyword, index) => {
      console.log(`   ${index + 1}. ${keyword.keyword} (${keyword.search_volume} searches)`);
    });

  } catch (error) {
    console.error('❌ Error fetching keywords:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchAhrefsKeywords, saveKeywords };
