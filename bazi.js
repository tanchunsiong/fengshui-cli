#!/usr/bin/env node
/**
 * BaZi (Four Pillars of Destiny) Calculator
 * 八字 / 四柱推命
 * 
 * Calculate destiny based on birth date and time
 */

const { Solar, Lunar } = require('lunar-typescript');

// Heavenly Stems (天干) with elements
const HEAVENLY_STEMS = {
  '甲': { pinyin: 'Jiǎ', element: 'Wood', yin: false, english: 'Yang Wood' },
  '乙': { pinyin: 'Yǐ', element: 'Wood', yin: true, english: 'Yin Wood' },
  '丙': { pinyin: 'Bǐng', element: 'Fire', yin: false, english: 'Yang Fire' },
  '丁': { pinyin: 'Dīng', element: 'Fire', yin: true, english: 'Yin Fire' },
  '戊': { pinyin: 'Wù', element: 'Earth', yin: false, english: 'Yang Earth' },
  '己': { pinyin: 'Jǐ', element: 'Earth', yin: true, english: 'Yin Earth' },
  '庚': { pinyin: 'Gēng', element: 'Metal', yin: false, english: 'Yang Metal' },
  '辛': { pinyin: 'Xīn', element: 'Metal', yin: true, english: 'Yin Metal' },
  '壬': { pinyin: 'Rén', element: 'Water', yin: false, english: 'Yang Water' },
  '癸': { pinyin: 'Guǐ', element: 'Water', yin: true, english: 'Yin Water' }
};

// Earthly Branches (地支) with animals and elements
const EARTHLY_BRANCHES = {
  '子': { pinyin: 'Zǐ', animal: 'Rat', element: 'Water', yin: true, hours: '23:00-01:00' },
  '丑': { pinyin: 'Chǒu', animal: 'Ox', element: 'Earth', yin: true, hours: '01:00-03:00' },
  '寅': { pinyin: 'Yín', animal: 'Tiger', element: 'Wood', yin: false, hours: '03:00-05:00' },
  '卯': { pinyin: 'Mǎo', animal: 'Rabbit', element: 'Wood', yin: true, hours: '05:00-07:00' },
  '辰': { pinyin: 'Chén', animal: 'Dragon', element: 'Earth', yin: false, hours: '07:00-09:00' },
  '巳': { pinyin: 'Sì', animal: 'Snake', element: 'Fire', yin: true, hours: '09:00-11:00' },
  '午': { pinyin: 'Wǔ', animal: 'Horse', element: 'Fire', yin: false, hours: '11:00-13:00' },
  '未': { pinyin: 'Wèi', animal: 'Goat', element: 'Earth', yin: true, hours: '13:00-15:00' },
  '申': { pinyin: 'Shēn', animal: 'Monkey', element: 'Metal', yin: false, hours: '15:00-17:00' },
  '酉': { pinyin: 'Yǒu', animal: 'Rooster', element: 'Metal', yin: true, hours: '17:00-19:00' },
  '戌': { pinyin: 'Xū', animal: 'Dog', element: 'Earth', yin: false, hours: '19:00-21:00' },
  '亥': { pinyin: 'Hài', animal: 'Pig', element: 'Water', yin: true, hours: '21:00-23:00' }
};

// Element colors for display
const ELEMENT_COLORS = {
  'Wood': '\x1b[32m',   // Green
  'Fire': '\x1b[31m',   // Red
  'Earth': '\x1b[33m',  // Yellow
  'Metal': '\x1b[37m',  // White
  'Water': '\x1b[34m'   // Blue
};

// Day Master personality traits
const DAY_MASTER_TRAITS = {
  '甲': {
    nature: 'The Towering Tree',
    traits: ['Leader', 'Ambitious', 'Straightforward', 'Stubborn'],
    description: 'Strong, principled, and growth-oriented. Natural leaders who stand tall like great trees.'
  },
  '乙': {
    nature: 'The Flexible Vine',
    traits: ['Adaptable', 'Diplomatic', 'Gentle', 'Persistent'],
    description: 'Graceful and resilient. Bends but doesn\'t break, finding paths around obstacles.'
  },
  '丙': {
    nature: 'The Blazing Sun',
    traits: ['Charismatic', 'Generous', 'Optimistic', 'Impatient'],
    description: 'Radiates warmth and energy. Natural entertainers who light up any room.'
  },
  '丁': {
    nature: 'The Candlelight',
    traits: ['Thoughtful', 'Creative', 'Intuitive', 'Sensitive'],
    description: 'Illuminates details others miss. Artistic souls with deep emotional intelligence.'
  },
  '戊': {
    nature: 'The Mountain',
    traits: ['Reliable', 'Patient', 'Nurturing', 'Stubborn'],
    description: 'Solid and dependable. Creates stability and provides a foundation for others.'
  },
  '己': {
    nature: 'The Garden Soil',
    traits: ['Nurturing', 'Detail-oriented', 'Humble', 'Anxious'],
    description: 'Supports growth in others. Practical minds who cultivate success quietly.'
  },
  '庚': {
    nature: 'The Sword',
    traits: ['Decisive', 'Direct', 'Justice-minded', 'Harsh'],
    description: 'Sharp and commanding. Warriors who cut through problems with decisive action.'
  },
  '辛': {
    nature: 'The Jewel',
    traits: ['Refined', 'Perfectionist', 'Principled', 'Sensitive'],
    description: 'Values beauty and quality. Discerning minds that seek perfection in all things.'
  },
  '壬': {
    nature: 'The Ocean',
    traits: ['Wise', 'Adventurous', 'Philosophical', 'Restless'],
    description: 'Deep and far-reaching. Intellectual explorers with vast inner worlds.'
  },
  '癸': {
    nature: 'The Rain',
    traits: ['Intuitive', 'Nurturing', 'Imaginative', 'Moody'],
    description: 'Brings life and nourishment. Deeply empathetic souls who sense unseen currents.'
  }
};

// Element interactions
const ELEMENT_INTERACTIONS = {
  produces: { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' },
  controls: { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' },
  weakens: { Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal' }
};

/**
 * Calculate BaZi (Four Pillars) from birth date/time
 */
function calculateBaZi(year, month, day, hour = 12, minute = 0) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  
  // Get the four pillars
  const pillars = {
    year: {
      pillar: eightChar.getYear(),
      stem: eightChar.getYearGan(),
      branch: eightChar.getYearZhi(),
      stemInfo: HEAVENLY_STEMS[eightChar.getYearGan()],
      branchInfo: EARTHLY_BRANCHES[eightChar.getYearZhi()]
    },
    month: {
      pillar: eightChar.getMonth(),
      stem: eightChar.getMonthGan(),
      branch: eightChar.getMonthZhi(),
      stemInfo: HEAVENLY_STEMS[eightChar.getMonthGan()],
      branchInfo: EARTHLY_BRANCHES[eightChar.getMonthZhi()]
    },
    day: {
      pillar: eightChar.getDay(),
      stem: eightChar.getDayGan(),
      branch: eightChar.getDayZhi(),
      stemInfo: HEAVENLY_STEMS[eightChar.getDayGan()],
      branchInfo: EARTHLY_BRANCHES[eightChar.getDayZhi()]
    },
    hour: {
      pillar: eightChar.getTime(),
      stem: eightChar.getTimeGan(),
      branch: eightChar.getTimeZhi(),
      stemInfo: HEAVENLY_STEMS[eightChar.getTimeGan()],
      branchInfo: EARTHLY_BRANCHES[eightChar.getTimeZhi()]
    }
  };
  
  // Day Master is the day's Heavenly Stem
  const dayMaster = {
    stem: pillars.day.stem,
    info: pillars.day.stemInfo,
    traits: DAY_MASTER_TRAITS[pillars.day.stem]
  };
  
  // Calculate element distribution
  const elements = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  
  // Count elements from all stems and branches
  Object.values(pillars).forEach(p => {
    if (p.stemInfo) elements[p.stemInfo.element]++;
    if (p.branchInfo) elements[p.branchInfo.element]++;
  });
  
  // Determine lucky and unlucky elements based on Day Master
  const dayElement = dayMaster.info.element;
  const luckyElements = [];
  const unluckyElements = [];
  
  // Simplified logic: 
  // - Lucky: element that produces Day Master, same element (for support)
  // - Unlucky: element that controls Day Master
  luckyElements.push(ELEMENT_INTERACTIONS.produces[dayElement]); // What produces me
  Object.entries(ELEMENT_INTERACTIONS.produces).forEach(([from, to]) => {
    if (to === dayElement) luckyElements.push(from); // What I'm produced by
  });
  
  Object.entries(ELEMENT_INTERACTIONS.controls).forEach(([controller, controlled]) => {
    if (controlled === dayElement) unluckyElements.push(controller);
  });
  
  // Get major life cycles (大運)
  const yun = eightChar.getYun(lunar.getYearGan() === '甲' || lunar.getYearGan() === '丙' || 
                               lunar.getYearGan() === '戊' || lunar.getYearGan() === '庚' || 
                               lunar.getYearGan() === '壬' ? 1 : 0); // 1 for male, 0 for female - defaulting
  
  let daYun = [];
  try {
    const yunList = yun.getDaYun();
    daYun = yunList.slice(0, 8).map(dy => ({
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      ganZhi: dy.getGanZhi(),
      stem: dy.getGanZhi()[0],
      branch: dy.getGanZhi()[1]
    }));
  } catch (e) {
    // Life cycles calculation may fail for some dates
  }
  
  return {
    birthDate: { year, month, day, hour, minute },
    solarDate: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`,
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    pillars,
    dayMaster,
    elements,
    luckyElements: [...new Set(luckyElements)],
    unluckyElements: [...new Set(unluckyElements)],
    zodiac: pillars.year.branchInfo.animal,
    daYun
  };
}

/**
 * Format BaZi for terminal display
 */
function formatBaZi(bazi) {
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';
  const dim = '\x1b[2m';
  const cyan = '\x1b[36m';
  const gold = '\x1b[33m';
  
  let output = '\n';
  output += `${bold}${cyan}═══════════════════════════════════════════════════════════${reset}\n`;
  output += `${bold}${gold}              八 字 命 盘 · FOUR PILLARS OF DESTINY${reset}\n`;
  output += `${cyan}═══════════════════════════════════════════════════════════${reset}\n\n`;
  
  // Birth info
  output += `${dim}Solar:${reset} ${bazi.solarDate} ${String(bazi.birthDate.hour).padStart(2, '0')}:${String(bazi.birthDate.minute).padStart(2, '0')}\n`;
  output += `${dim}Lunar:${reset} ${bazi.lunarDate}\n`;
  output += `${dim}Zodiac:${reset} ${bazi.zodiac}\n\n`;
  
  // Four Pillars display
  output += `${bold}┌─────────┬─────────┬─────────┬─────────┐${reset}\n`;
  output += `${bold}│  HOUR   │   DAY   │  MONTH  │  YEAR   │${reset}\n`;
  output += `${bold}│  時柱   │  日柱   │  月柱   │  年柱   │${reset}\n`;
  output += `${bold}├─────────┼─────────┼─────────┼─────────┤${reset}\n`;
  
  // Heavenly Stems row
  const pillars = [bazi.pillars.hour, bazi.pillars.day, bazi.pillars.month, bazi.pillars.year];
  output += `│`;
  pillars.forEach(p => {
    const color = ELEMENT_COLORS[p.stemInfo.element];
    output += `  ${color}${bold}${p.stem}${reset}      │`;
  });
  output += '\n';
  
  // Stem elements
  output += `│`;
  pillars.forEach(p => {
    const color = ELEMENT_COLORS[p.stemInfo.element];
    output += ` ${color}${p.stemInfo.element.padEnd(7)}${reset}│`;
  });
  output += '\n';
  
  output += `${bold}├─────────┼─────────┼─────────┼─────────┤${reset}\n`;
  
  // Earthly Branches row
  output += `│`;
  pillars.forEach(p => {
    const color = ELEMENT_COLORS[p.branchInfo.element];
    output += `  ${color}${bold}${p.branch}${reset}      │`;
  });
  output += '\n';
  
  // Branch animals
  output += `│`;
  pillars.forEach(p => {
    output += ` ${p.branchInfo.animal.padEnd(7)}│`;
  });
  output += '\n';
  
  output += `${bold}└─────────┴─────────┴─────────┴─────────┘${reset}\n\n`;
  
  // Day Master
  const dmColor = ELEMENT_COLORS[bazi.dayMaster.info.element];
  output += `${bold}${gold}日主 DAY MASTER: ${dmColor}${bazi.dayMaster.stem} ${bazi.dayMaster.info.english}${reset}\n`;
  output += `${dim}${bazi.dayMaster.traits.nature}${reset}\n`;
  output += `${bazi.dayMaster.traits.description}\n\n`;
  output += `${dim}Traits:${reset} ${bazi.dayMaster.traits.traits.join(' · ')}\n\n`;
  
  // Element distribution
  output += `${bold}五行 FIVE ELEMENTS:${reset}\n`;
  const maxCount = Math.max(...Object.values(bazi.elements));
  Object.entries(bazi.elements).forEach(([element, count]) => {
    const color = ELEMENT_COLORS[element];
    const bar = '█'.repeat(count * 3) + '░'.repeat((maxCount - count) * 3);
    output += `${color}${element.padEnd(6)}${reset} ${bar} ${count}\n`;
  });
  output += '\n';
  
  // Lucky elements
  output += `${bold}${green}✓ Lucky Elements:${reset} ${bazi.luckyElements.join(', ')}\n`;
  output += `${bold}${red}✗ Challenging:${reset} ${bazi.unluckyElements.join(', ')}\n\n`;
  
  // Life cycles (if available)
  if (bazi.daYun.length > 0) {
    output += `${bold}大運 MAJOR LIFE CYCLES:${reset}\n`;
    bazi.daYun.forEach(cycle => {
      output += `${dim}Age ${String(cycle.startAge).padStart(2)}-${String(cycle.endAge).padStart(2)}:${reset} ${cycle.ganZhi}\n`;
    });
    output += '\n';
  }
  
  output += `${cyan}═══════════════════════════════════════════════════════════${reset}\n`;
  
  return output;
}

const green = '\x1b[32m';
const red = '\x1b[31m';

/**
 * Get BaZi as JSON (for API)
 */
function getBaZiJSON(year, month, day, hour = 12, minute = 0, gender = 'male') {
  const bazi = calculateBaZi(year, month, day, hour, minute);
  
  return {
    input: { year, month, day, hour, minute, gender },
    solarDate: bazi.solarDate,
    lunarDate: bazi.lunarDate,
    zodiac: bazi.zodiac,
    fourPillars: {
      year: {
        chinese: bazi.pillars.year.pillar,
        stem: { chinese: bazi.pillars.year.stem, ...bazi.pillars.year.stemInfo },
        branch: { chinese: bazi.pillars.year.branch, ...bazi.pillars.year.branchInfo }
      },
      month: {
        chinese: bazi.pillars.month.pillar,
        stem: { chinese: bazi.pillars.month.stem, ...bazi.pillars.month.stemInfo },
        branch: { chinese: bazi.pillars.month.branch, ...bazi.pillars.month.branchInfo }
      },
      day: {
        chinese: bazi.pillars.day.pillar,
        stem: { chinese: bazi.pillars.day.stem, ...bazi.pillars.day.stemInfo },
        branch: { chinese: bazi.pillars.day.branch, ...bazi.pillars.day.branchInfo }
      },
      hour: {
        chinese: bazi.pillars.hour.pillar,
        stem: { chinese: bazi.pillars.hour.stem, ...bazi.pillars.hour.stemInfo },
        branch: { chinese: bazi.pillars.hour.branch, ...bazi.pillars.hour.branchInfo }
      }
    },
    dayMaster: {
      chinese: bazi.dayMaster.stem,
      element: bazi.dayMaster.info.element,
      english: bazi.dayMaster.info.english,
      nature: bazi.dayMaster.traits.nature,
      traits: bazi.dayMaster.traits.traits,
      description: bazi.dayMaster.traits.description
    },
    elements: bazi.elements,
    luckyElements: bazi.luckyElements,
    unluckyElements: bazi.unluckyElements,
    lifeCycles: bazi.daYun
  };
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log(`
八字 BaZi Calculator - Four Pillars of Destiny

Usage:
  bazi <YYYY-MM-DD> [HH:MM]    Calculate BaZi for birthdate
  bazi json <YYYY-MM-DD> [HH:MM]  Output as JSON

Examples:
  bazi 1990-05-15              Birth date only (noon assumed)
  bazi 1990-05-15 14:30        Birth date with time
  bazi json 1990-05-15 14:30   JSON output for API

Note: Birth time significantly affects the Hour Pillar.
      If unknown, noon (12:00) is used as default.
`);
    process.exit(0);
  }
  
  const jsonMode = args[0] === 'json';
  const dateArg = jsonMode ? args[1] : args[0];
  const timeArg = jsonMode ? args[2] : args[1];
  
  if (!dateArg) {
    console.error('Error: Please provide a birth date (YYYY-MM-DD)');
    process.exit(1);
  }
  
  const dateParts = dateArg.split('-').map(Number);
  if (dateParts.length !== 3) {
    console.error('Error: Invalid date format. Use YYYY-MM-DD');
    process.exit(1);
  }
  
  const [year, month, day] = dateParts;
  let hour = 12, minute = 0;
  
  if (timeArg) {
    const timeParts = timeArg.split(':').map(Number);
    hour = timeParts[0] || 12;
    minute = timeParts[1] || 0;
  }
  
  try {
    if (jsonMode) {
      console.log(JSON.stringify(getBaZiJSON(year, month, day, hour, minute), null, 2));
    } else {
      const bazi = calculateBaZi(year, month, day, hour, minute);
      console.log(formatBaZi(bazi));
    }
  } catch (e) {
    console.error('Error calculating BaZi:', e.message);
    process.exit(1);
  }
}

module.exports = { calculateBaZi, formatBaZi, getBaZiJSON, HEAVENLY_STEMS, EARTHLY_BRANCHES, DAY_MASTER_TRAITS };
