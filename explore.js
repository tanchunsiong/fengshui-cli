#!/usr/bin/env node
// Exploring lunar-typescript capabilities
const { Solar, Lunar, HolidayUtil } = require('lunar-typescript');

// Get today's date
const today = Solar.fromDate(new Date());
const lunar = today.getLunar();

console.log('=== SOLAR (公历) ===');
console.log(`Date: ${today.getYear()}-${today.getMonth()}-${today.getDay()}`);
console.log(`Week: ${today.getWeek()} (${today.getWeekInChinese()})`);
console.log(`Constellation: ${today.getXingZuo()}`);

console.log('\n=== LUNAR (农历) ===');
console.log(`Lunar Date: ${lunar.getYear()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`);
console.log(`Zodiac Year: ${lunar.getYearShengXiao()} (${lunar.getYearInGanZhi()})`);
console.log(`Month in GanZhi: ${lunar.getMonthInGanZhi()}`);
console.log(`Day in GanZhi: ${lunar.getDayInGanZhi()}`);

console.log('\n=== ELEMENTS (五行) ===');
console.log(`Year NaYin: ${lunar.getYearNaYin()}`);
console.log(`Month NaYin: ${lunar.getMonthNaYin()}`);
console.log(`Day NaYin: ${lunar.getDayNaYin()}`);

console.log('\n=== DAILY YI/JI (每日宜忌) ===');
console.log(`Yi (宜 - Auspicious): ${lunar.getDayYi().join(', ')}`);
console.log(`Ji (忌 - Inauspicious): ${lunar.getDayJi().join(', ')}`);

console.log('\n=== GODS & SPIRITS ===');
console.log(`Xi Shen (喜神): ${lunar.getDayPositionXi()} / ${lunar.getDayPositionXiDesc()}`);
console.log(`Fu Shen (福神): ${lunar.getDayPositionFu()} / ${lunar.getDayPositionFuDesc()}`);
console.log(`Cai Shen (财神): ${lunar.getDayPositionCai()} / ${lunar.getDayPositionCaiDesc()}`);

console.log('\n=== CLASH (冲煞) ===');
console.log(`Chong (冲): ${lunar.getDayChong()} ${lunar.getDayChongDesc()}`);
console.log(`Sha (煞): ${lunar.getDaySha()}`);

console.log('\n=== SOLAR TERMS (节气) ===');
console.log(`Current JieQi: ${lunar.getJieQi() || 'None'}`);
console.log(`Prev JieQi: ${lunar.getPrevJieQi()?.getName() || 'None'}`);
console.log(`Next JieQi: ${lunar.getNextJieQi()?.getName() || 'None'}`);

console.log('\n=== PENG ZU (彭祖百忌) ===');
console.log(`Tian Gan: ${lunar.getPengZuGan()}`);
console.log(`Di Zhi: ${lunar.getPengZuZhi()}`);

// Try to get time-based info
console.log('\n=== CURRENT HOUR (时辰) ===');
const hour = new Date().getHours();
const lunarHour = lunar.getTimeZhi();
console.log(`Current Shi Chen: ${lunarHour}`);

// Try Lucky/Unlucky hours
console.log('\n=== HOURS YI/JI ===');
try {
  const times = lunar.getTimes();
  times.forEach(t => {
    console.log(`${t.getGanZhi()} (${t.getName()}): Yi=${t.getYi().slice(0,3).join(', ')}...`);
  });
} catch(e) {
  console.log('Times API not available');
}
