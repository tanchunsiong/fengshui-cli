/**
 * fengshui-cli/lib.js - Core library for Chinese Almanac calculations
 * Built by Cortana using lunar-typescript
 */

const { Solar, Lunar } = require('lunar-typescript');

// Element mappings for English
const ELEMENTS = {
  '金': 'Metal',
  '木': 'Wood', 
  '水': 'Water',
  '火': 'Fire',
  '土': 'Earth'
};

// Heavenly Stems (天干) to Element mapping
// 甲乙=木, 丙丁=火, 戊己=土, 庚辛=金, 壬癸=水
const STEM_ELEMENTS = {
  '甲': 'Wood', '乙': 'Wood',
  '丙': 'Fire', '丁': 'Fire',
  '戊': 'Earth', '己': 'Earth',
  '庚': 'Metal', '辛': 'Metal',
  '壬': 'Water', '癸': 'Water'
};

const STEM_ELEMENTS_CN = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// Zodiac mappings
const ZODIAC = {
  '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
  '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
  '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
};

// Direction mappings  
const DIRECTIONS = {
  '东': 'East', '南': 'South', '西': 'West', '北': 'North',
  '东北': 'Northeast', '东南': 'Southeast', 
  '西北': 'Northwest', '西南': 'Southwest',
  '坤': 'Southwest (Kun)', '乾': 'Northwest (Qian)',
  '艮': 'Northeast (Gen)', '巽': 'Southeast (Xun)',
  '坎': 'North (Kan)', '离': 'South (Li)',
  '震': 'East (Zhen)', '兑': 'West (Dui)'
};

// Common Yi/Ji activity translations
const ACTIVITIES = {
  '沐浴': 'Bathing/Grooming',
  '理发': 'Haircut',
  '安葬': 'Burial',
  '破土': 'Breaking Ground',
  '入殓': 'Placing in Coffin',
  '除服': 'Ending Mourning',
  '成服': 'Wearing Mourning',
  '修坟': 'Repairing Grave',
  '启钻': 'Opening Grave',
  '立碑': 'Erecting Monument',
  '谢土': 'Thanking Earth',
  '捕捉': 'Hunting/Trapping',
  '畋猎': 'Hunting',
  '整手足甲': 'Nail Care',
  '祭祀': 'Sacrifices/Worship',
  '祈福': 'Praying',
  '求嗣': 'Seeking Children',
  '开光': 'Consecration',
  '出行': 'Traveling',
  '解除': 'Removing Obstacles',
  '安床': 'Installing Bed',
  '纳畜': 'Acquiring Livestock',
  '入宅': 'Moving In',
  '移徙': 'Moving/Relocating',
  '动土': 'Starting Construction',
  '纳财': 'Collecting Money',
  '开市': 'Opening Business',
  '交易': 'Trading',
  '立券': 'Signing Contracts',
  '栽种': 'Planting',
  '安门': 'Installing Door',
  '修造': 'Renovating',
  '嫁娶': 'Wedding',
  '纳采': 'Proposing Marriage',
  '订盟': 'Engagement',
  '上梁': 'Raising Beam',
  '斋醮': 'Fasting/Rituals',
  '盖屋': 'Building House'
};

function translateActivity(cn) {
  return ACTIVITIES[cn] || cn;
}

function translateDirection(cn) {
  return DIRECTIONS[cn] || cn;
}

function translateZodiac(cn) {
  return ZODIAC[cn] || cn;
}

function extractElement(nayin) {
  for (const [cn, en] of Object.entries(ELEMENTS)) {
    if (nayin.includes(cn)) return en;
  }
  return nayin;
}

/**
 * Get almanac data for a given date
 * @param {Date|string} date - Date object or ISO date string (YYYY-MM-DD)
 * @returns {Object} Complete almanac data
 */
function getAlmanacData(date = new Date()) {
  if (typeof date === 'string') {
    const [y, m, d] = date.split('-').map(Number);
    date = new Date(y, m - 1, d);
  }
  
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  
  return {
    solar: {
      date: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`,
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      weekday: solar.getWeekInChinese(),
      weekdayEn: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][solar.getWeek()],
      constellation: solar.getXingZuo()
    },
    lunar: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      monthCn: lunar.getMonthInChinese(),
      dayCn: lunar.getDayInChinese(),
      ganZhiYear: lunar.getYearInGanZhi(),
      ganZhiMonth: lunar.getMonthInGanZhi(),
      ganZhiDay: lunar.getDayInGanZhi(),
      ganZhiHour: lunar.getTimeInGanZhi ? lunar.getTimeInGanZhi() : null,
      zodiac: lunar.getYearShengXiao(),
      zodiacEn: translateZodiac(lunar.getYearShengXiao()),
      isLeapMonth: lunar.isLeapMonth ? lunar.isLeapMonth() : false
    },
    elements: {
      yearNaYin: lunar.getYearNaYin(),
      yearNaYinElement: extractElement(lunar.getYearNaYin()),
      monthNaYin: lunar.getMonthNaYin(),
      monthNaYinElement: extractElement(lunar.getMonthNaYin()),
      dayNaYin: lunar.getDayNaYin(),
      dayNaYinElement: extractElement(lunar.getDayNaYin()),
      // Day Stem element (五行) - the primary element of the day
      dayStem: lunar.getDayInGanZhi().charAt(0),
      dayElement: STEM_ELEMENTS[lunar.getDayInGanZhi().charAt(0)] || 'Unknown',
      dayElementCn: STEM_ELEMENTS_CN[lunar.getDayInGanZhi().charAt(0)] || '?'
    },
    activities: {
      yi: lunar.getDayYi(),
      ji: lunar.getDayJi(),
      yiEn: lunar.getDayYi().map(translateActivity),
      jiEn: lunar.getDayJi().map(translateActivity)
    },
    gods: {
      xiShen: { 
        direction: lunar.getDayPositionXi(), 
        desc: lunar.getDayPositionXiDesc(),
        directionEn: translateDirection(lunar.getDayPositionXi())
      },
      fuShen: { 
        direction: lunar.getDayPositionFu(), 
        desc: lunar.getDayPositionFuDesc(),
        directionEn: translateDirection(lunar.getDayPositionFu())
      },
      caiShen: { 
        direction: lunar.getDayPositionCai(), 
        desc: lunar.getDayPositionCaiDesc(),
        directionEn: translateDirection(lunar.getDayPositionCai())
      }
    },
    clash: {
      chong: lunar.getDayChong(),
      chongDesc: lunar.getDayChongDesc(),
      sha: lunar.getDaySha(),
      shaEn: translateDirection(lunar.getDaySha())
    },
    solarTerms: {
      current: lunar.getJieQi() || null,
      prev: lunar.getPrevJieQi()?.getName() || null,
      prevDate: lunar.getPrevJieQi()?.getSolar()?.toString() || null,
      next: lunar.getNextJieQi()?.getName() || null,
      nextDate: lunar.getNextJieQi()?.getSolar()?.toString() || null
    },
    pengZu: {
      gan: lunar.getPengZuGan(),
      zhi: lunar.getPengZuZhi()
    },
    festivals: {
      lunar: lunar.getFestivals(),
      solar: solar.getFestivals()
    }
  };
}

/**
 * Format almanac data for terminal display
 */
function formatAlmanac(data, options = {}) {
  const output = [];
  
  output.push('╔══════════════════════════════════════════════╗');
  output.push(`║  📅 ${data.solar.date} (${data.solar.weekdayEn})`.padEnd(47) + '║');
  output.push(`║  🌙 农历 ${data.lunar.year}年${data.lunar.monthCn}月${data.lunar.dayCn}`.padEnd(44) + '║');
  output.push('╠══════════════════════════════════════════════╣');
  
  output.push(`║  干支 ${data.lunar.ganZhiYear}年 ${data.lunar.ganZhiMonth}月 ${data.lunar.ganZhiDay}日`.padEnd(42) + '║');
  output.push(`║  生肖 ${data.lunar.zodiac} (Year of the ${data.lunar.zodiacEn})`.padEnd(45) + '║');
  
  output.push('╠══════════════════════════════════════════════╣');
  output.push(`║  🔥 日元素 Day Element: ${data.elements.dayElement}`.padEnd(45) + '║');
  output.push(`║  纳音: ${data.elements.dayNaYin}`.padEnd(44) + '║');
  
  output.push('╠══════════════════════════════════════════════╣');
  output.push('║  ✅ 宜 (Auspicious):'.padEnd(47) + '║');
  const yiItems = data.activities.yi.slice(0, 5).join(', ');
  output.push(`║     ${yiItems}`.padEnd(47) + '║');
  
  output.push('║  ❌ 忌 (Avoid):'.padEnd(47) + '║');
  const jiItems = data.activities.ji.slice(0, 5).join(', ');
  output.push(`║     ${jiItems}`.padEnd(47) + '║');
  
  output.push('╠══════════════════════════════════════════════╣');
  output.push(`║  😊 喜神 Joy God: ${data.gods.xiShen.desc}`.padEnd(45) + '║');
  output.push(`║  💰 财神 Wealth God: ${data.gods.caiShen.desc}`.padEnd(45) + '║');
  output.push(`║  🙏 福神 Fortune God: ${data.gods.fuShen.desc}`.padEnd(45) + '║');
  
  output.push('╠══════════════════════════════════════════════╣');
  output.push(`║  ⚠️  冲 Clash: ${data.clash.chongDesc}`.padEnd(45) + '║');
  output.push(`║  🧭 煞 Evil Direction: ${data.clash.shaEn}`.padEnd(45) + '║');
  
  if (data.festivals.lunar.length > 0 || data.festivals.solar.length > 0) {
    output.push('╠══════════════════════════════════════════════╣');
    const festivals = [...data.festivals.lunar, ...data.festivals.solar];
    output.push(`║  🎉 ${festivals.join(', ')}`.padEnd(47) + '║');
  }
  
  output.push('╚══════════════════════════════════════════════╝');
  
  return output.join('\n');
}

/**
 * Generate social media post content
 */
function generateSocialPost(data, options = {}) {
  const { platform = 'general' } = options;
  
  const topYi = data.activities.yi.slice(0, 3);
  const topJi = data.activities.ji.slice(0, 3);
  
  const post = [];
  
  post.push(`📅 ${data.solar.date} | 农历${data.lunar.monthCn}月${data.lunar.dayCn}`);
  post.push(`🐲 ${data.lunar.ganZhiYear}年 ${data.lunar.ganZhiDay}日`);
  post.push(`🔥 Element: ${data.elements.dayElement} (${data.elements.dayNaYin})`);
  post.push('');
  post.push(`✅ Auspicious: ${topYi.join('、')}`);
  post.push(`❌ Avoid: ${topJi.join('、')}`);
  post.push('');
  post.push(`💰 Wealth Direction: ${data.gods.caiShen.desc}`);
  post.push(`⚠️ Clash: ${data.clash.chongDesc}`);
  
  if (platform === 'twitter' || platform === 'x') {
    post.push('');
    post.push('#ChineseAlmanac #FengShui #通胜 #黄历');
  }
  
  return post.join('\n');
}

/**
 * Generate data structure for image creation
 */
function generateImageData(data) {
  return {
    title: `Chinese Almanac | 通胜黄历`,
    date: data.solar.date,
    lunarDate: `${data.lunar.monthCn}月${data.lunar.dayCn}`,
    dayPillar: data.lunar.ganZhiDay,
    element: data.elements.dayElement,
    elementCn: data.elements.dayNaYin,
    yi: data.activities.yi.slice(0, 6),
    ji: data.activities.ji.slice(0, 6),
    wealthDirection: data.gods.caiShen.desc,
    clash: data.clash.chongDesc,
    zodiac: data.lunar.zodiac
  };
}

/**
 * Get almanac for date range
 */
function getAlmanacRange(startDate, endDate) {
  const results = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    results.push(getAlmanacData(new Date(d)));
  }
  
  return results;
}

/**
 * Find auspicious dates for a specific activity
 */
function findAuspiciousDates(activity, days = 30, startDate = new Date()) {
  const results = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const data = getAlmanacData(d);
    
    if (data.activities.yi.includes(activity)) {
      results.push({
        date: data.solar.date,
        lunar: `${data.lunar.monthCn}月${data.lunar.dayCn}`,
        element: data.elements.dayElement,
        yi: data.activities.yi,
        clash: data.clash.chongDesc
      });
    }
  }
  
  return results;
}

module.exports = {
  getAlmanacData,
  formatAlmanac,
  generateSocialPost,
  generateImageData,
  getAlmanacRange,
  findAuspiciousDates,
  // Export helpers for advanced users
  translateActivity,
  translateDirection,
  translateZodiac,
  extractElement,
  ELEMENTS,
  ZODIAC,
  DIRECTIONS,
  ACTIVITIES
};
