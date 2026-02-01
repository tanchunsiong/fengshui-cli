#!/usr/bin/env node
/**
 * Content Generator for ChunFengShui
 * Generates humanized, bilingual social media content
 */

const { Solar, Lunar } = require('lunar-typescript');

// Element vibes
const ELEMENT_VIBES = {
  'Metal': { emoji: '⚔️', vibe: 'clarity and precision', advice: 'Good for decisive action and cutting through confusion.' },
  'Wood': { emoji: '🌱', vibe: 'growth and creativity', advice: 'Plant seeds for future projects. Nurture what matters.' },
  'Water': { emoji: '💧', vibe: 'wisdom and flow', advice: 'Go with the flow. Adaptability is your superpower today.' },
  'Fire': { emoji: '🔥', vibe: 'passion and transformation', advice: 'Bring energy and enthusiasm. Ignite positive change.' },
  'Earth': { emoji: '🏔️', vibe: 'stability and grounding', advice: 'Focus on foundations. Build something lasting.' }
};

// Common activities with humanized descriptions
const ACTIVITY_ADVICE = {
  '嫁娶': { good: '💍 Great day for weddings and romance!', bad: '💔 Not ideal for wedding plans today.' },
  '开市': { good: '🏪 Excellent for launching or opening business!', bad: '⏸️ Hold off on business launches.' },
  '出行': { good: '✈️ Favorable for travel!', bad: '🏠 Better to stay local today.' },
  '移徙': { good: '📦 Good energy for moving homes!', bad: '🏠 Not the best day to relocate.' },
  '入宅': { good: '🏡 Auspicious for moving into a new home!', bad: null },
  '动土': { good: '🚧 Good for breaking ground on construction!', bad: '⚠️ Avoid starting construction.' },
  '安床': { good: '🛏️ Perfect for setting up your bed!', bad: '💤 Hold off on bed positioning.' },
  '祈福': { good: '🙏 Ideal for prayers and blessings!', bad: null },
  '沐浴': { good: '🛁 Good day for self-care and cleansing!', bad: null },
  '理发': { good: '💇 Auspicious for haircuts!', bad: '✂️ Skip the haircut today.' },
  '纳财': { good: '💰 Favorable for receiving money!', bad: null },
  '交易': { good: '🤝 Good for business deals!', bad: '⏳ Postpone major transactions.' }
};

function extractElement(nayin) {
  const map = { '金': 'Metal', '木': 'Wood', '水': 'Water', '火': 'Fire', '土': 'Earth' };
  for (const [cn, en] of Object.entries(map)) {
    if (nayin.includes(cn)) return en;
  }
  return 'Earth';
}

function generateHumanContent(date = new Date()) {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdays[solar.getWeek()];
  
  const dayPillar = lunar.getDayInGanZhi();
  const element = extractElement(lunar.getDayNaYin());
  const elementInfo = ELEMENT_VIBES[element];
  
  const yi = lunar.getDayYi();
  const ji = lunar.getDayJi();
  
  // Find notable activities
  const highlights = [];
  for (const activity of yi) {
    if (ACTIVITY_ADVICE[activity]?.good) {
      highlights.push(ACTIVITY_ADVICE[activity].good);
    }
  }
  const warnings = [];
  for (const activity of ji) {
    if (ACTIVITY_ADVICE[activity]?.bad) {
      warnings.push(ACTIVITY_ADVICE[activity].bad);
    }
  }
  
  // Wealth direction with emoji + English
  const wealthDirCn = lunar.getDayPositionCaiDesc();
  const dirMap = {
    '东': 'East', '南': 'South', '西': 'West', '北': 'North',
    '东北': 'Northeast', '东南': 'Southeast', '西北': 'Northwest', '西南': 'Southwest',
    '正东': 'East', '正南': 'South', '正西': 'West', '正北': 'North'
  };
  const wealthDir = dirMap[wealthDirCn] || wealthDirCn;
  
  // Build humanized post
  const lines = [];
  
  // Opening
  const dateStr = `${solar.getMonth()}/${solar.getDay()}`;
  const lunarMonth = lunar.getMonthInChinese();
  const lunarDay = lunar.getDayInChinese();
  
  lines.push(`✨ Happy ${weekday}! Here's your Feng Shui forecast for ${dateStr}:`);
  lines.push('');
  
  // Element of the day
  lines.push(`${elementInfo.emoji} Today's Element: **${element}** (${lunar.getDayNaYin()})`);
  lines.push(`Energy: ${elementInfo.vibe}`);
  lines.push(elementInfo.advice);
  lines.push('');
  
  // Highlights
  if (highlights.length > 0) {
    lines.push('🌟 **Today is favorable for:**');
    highlights.slice(0, 3).forEach(h => lines.push(`• ${h.replace(/^[^\s]+\s/, '')}`));
    lines.push('');
  }
  
  // Warnings
  if (warnings.length > 0) {
    lines.push('⚠️ **Better to avoid:**');
    warnings.slice(0, 2).forEach(w => lines.push(`• ${w.replace(/^[^\s]+\s/, '')}`));
    lines.push('');
  }
  
  // Wealth tip
  lines.push(`💰 Wealth Direction: Face **${wealthDir}** for prosperity!`);
  
  // Clash warning
  const clash = lunar.getDayChongDesc();
  if (clash) {
    lines.push(`🐀 Those born in ${clash.replace(/[()]/g, '')} year - take extra care today.`);
  }
  
  return {
    full: lines.join('\n'),
    element,
    dayPillar,
    wealthDirection: wealthDir,
    yi: yi.slice(0, 5),
    ji: ji.slice(0, 5),
    lunarDate: `${lunarMonth}月${lunarDay}`
  };
}

function generateShortPost(date = new Date()) {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  const element = extractElement(lunar.getDayNaYin());
  const elementInfo = ELEMENT_VIBES[element];
  
  const dirMap = {
    '东': 'East', '南': 'South', '西': 'West', '北': 'North',
    '东北': 'Northeast', '东南': 'Southeast', '西北': 'Northwest', '西南': 'Southwest',
    '正东': 'East', '正南': 'South', '正西': 'West', '正北': 'North'
  };
  const wealthDir = dirMap[lunar.getDayPositionCaiDesc()] || lunar.getDayPositionCaiDesc();
  
  const dateStr = `${solar.getYear()}.${solar.getMonth()}.${solar.getDay()}`;
  
  return `${elementInfo.emoji} ${dateStr} | ${element} Day

${elementInfo.advice}

💰 Wealth: ${wealthDir}
✅ Good for: ${lunar.getDayYi().slice(0, 2).join(', ')}
❌ Avoid: ${lunar.getDayJi().slice(0, 2).join(', ')}

#FengShui #ChineseAlmanac`;
}

// CLI
const args = process.argv.slice(2);
const cmd = args[0] || 'full';

switch (cmd) {
  case 'full':
    console.log(generateHumanContent().full);
    break;
  case 'short':
    console.log(generateShortPost());
    break;
  case 'json':
    console.log(JSON.stringify(generateHumanContent(), null, 2));
    break;
  default:
    console.log('Usage: content [full|short|json]');
}
