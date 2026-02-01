#!/usr/bin/env node
/**
 * fengshui-cli - Chinese Almanac (通胜/黄历) & Feng Shui CLI
 * Built by Cortana @ OpenClaw
 * 
 * Uses lunar-typescript for accurate traditional Chinese calendar calculations
 */

const lib = require('./lib');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'today';

function showHelp() {
  console.log(`
fengshui-cli - Chinese Almanac & Feng Shui Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commands:
  today, almanac     Show today's almanac (default)
  json               Output almanac data as JSON
  post [platform]    Generate social media post (twitter/x/general)
  image              Generate data for image creation
  date YYYY-MM-DD    Show almanac for specific date
  range START END    Show almanac for date range
  find ACTIVITY [N]  Find next N days with auspicious activity
  server [port]      Start API server (default: 3888)
  help               Show this help

Examples:
  fengshui                  # Today's almanac
  fengshui json             # JSON output
  fengshui post twitter     # Twitter-ready post
  fengshui date 2026-02-14  # Valentine's Day almanac
  fengshui find 嫁娶 60     # Wedding dates in next 60 days
  fengshui server 8080      # Start API on port 8080

Programmatic Usage:
  const { getAlmanacData, findAuspiciousDates } = require('fengshui-cli/lib');
  const today = getAlmanacData();
  const weddingDates = findAuspiciousDates('嫁娶', 30);

Built with 💠 by Cortana using lunar-typescript
https://github.com/tanchunsiong/fengshui-cli
`);
}

switch (command) {
  case 'today':
  case 'almanac':
    console.log(lib.formatAlmanac(lib.getAlmanacData()));
    break;
    
  case 'json':
    console.log(JSON.stringify(lib.getAlmanacData(), null, 2));
    break;
    
  case 'post':
    const platform = args[1] || 'general';
    const postDate = args[2];
    const postData = postDate ? lib.getAlmanacData(postDate) : lib.getAlmanacData();
    console.log(lib.generateSocialPost(postData, { platform }));
    break;
    
  case 'image':
    const imgDate = args[1];
    const imgData = imgDate ? lib.getAlmanacData(imgDate) : lib.getAlmanacData();
    console.log(JSON.stringify(lib.generateImageData(imgData), null, 2));
    break;
    
  case 'date':
    const dateStr = args[1];
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.log(lib.formatAlmanac(lib.getAlmanacData(dateStr)));
    } else {
      console.log('Usage: fengshui date YYYY-MM-DD');
      console.log('Example: fengshui date 2026-02-14');
    }
    break;
    
  case 'range':
    const start = args[1];
    const end = args[2];
    if (start && end) {
      const range = lib.getAlmanacRange(start, end);
      range.forEach(d => {
        console.log(`\n${d.solar.date}:`);
        console.log(`  Element: ${d.elements.dayElement}`);
        console.log(`  Yi: ${d.activities.yi.slice(0, 3).join(', ')}`);
        console.log(`  Ji: ${d.activities.ji.slice(0, 3).join(', ')}`);
      });
    } else {
      console.log('Usage: fengshui range YYYY-MM-DD YYYY-MM-DD');
    }
    break;
    
  case 'find':
    const activity = args[1];
    const days = parseInt(args[2]) || 30;
    if (activity) {
      const results = lib.findAuspiciousDates(activity, days);
      console.log(`\n🔍 Finding dates for: ${activity}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      if (results.length === 0) {
        console.log(`No dates found in the next ${days} days.`);
      } else {
        results.forEach(r => {
          console.log(`\n📅 ${r.date} (${r.lunar})`);
          console.log(`   Element: ${r.element}`);
          console.log(`   Clash: ${r.clash}`);
        });
        console.log(`\nFound ${results.length} dates.`);
      }
    } else {
      console.log('Usage: fengshui find ACTIVITY [DAYS]');
      console.log('Example: fengshui find 嫁娶 60');
      console.log('\nCommon activities:');
      console.log('  嫁娶 (Wedding)   祈福 (Praying)   出行 (Traveling)');
      console.log('  开市 (Business)  入宅 (Moving)    动土 (Construction)');
    }
    break;
    
  case 'server':
  case 'serve':
  case 'api':
    // Start the API server
    process.argv = [process.argv[0], path.join(__dirname, 'server.js'), args[1] || '3888'];
    require('./server.js');
    break;
    
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
    
  default:
    // Check if it looks like a date
    if (/^\d{4}-\d{2}-\d{2}$/.test(command)) {
      console.log(lib.formatAlmanac(lib.getAlmanacData(command)));
    } else {
      console.log(`Unknown command: ${command}`);
      showHelp();
    }
}
