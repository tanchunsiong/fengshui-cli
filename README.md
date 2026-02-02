# fengshui-cli 🔮

Chinese Almanac (通胜/黄历) CLI & API - Traditional feng shui calendar data with auspicious/inauspicious activities, five element analysis, deity directions, and more.

[![npm version](https://img.shields.io/npm/v/fengshui-cli.svg)](https://npmjs.com/package/fengshui-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 📅 **Daily Almanac** - Complete Chinese almanac data for any date
- ✅ **Yi/Ji Activities** - Auspicious and inauspicious activities
- 🔥 **Five Elements** - Day, month, and year element analysis (五行)
- 🐲 **Gan Zhi** - Traditional stem-branch calendar (干支)
- 💰 **Deity Directions** - Wealth God, Fortune God, Joy God positions
- 🔍 **Date Finder** - Find auspicious dates for specific activities
- 🔮 **BaZi Calculator** - Four Pillars of Destiny (八字命盘) based on birth date/time
- 🌐 **API Server** - Built-in JSON API for web apps
- 🌙 **Festivals** - Lunar and solar festival detection

## Installation

```bash
# Global CLI
npm install -g fengshui-cli

# Local/programmatic use
npm install fengshui-cli
```

## CLI Usage

```bash
# Today's almanac
fengshui

# Specific date
fengshui date 2026-02-14

# JSON output
fengshui json

# Social media post
fengshui post twitter

# Find wedding dates
fengshui find 嫁娶 60

# Start API server
fengshui server 3888

# BaZi (Four Pillars) calculator
fengshui bazi 1990-05-15 14:30

# BaZi as JSON
fengshui bazi json 1990-05-15 14:30
```

## 🔮 BaZi Calculator (八字命盘)

Calculate your Four Pillars of Destiny based on birth date and time:

```bash
fengshui bazi 1990-05-15 14:30
```

This returns:
- **Four Pillars** (年柱 月柱 日柱 時柱) - Year, Month, Day, Hour
- **Day Master** (日主) - Your core personality based on day stem
- **Five Elements Distribution** - Balance of Wood, Fire, Earth, Metal, Water
- **Lucky/Unlucky Elements** - Elements that support or challenge you
- **Major Life Cycles** (大運) - 10-year periods and their influences

### Web Calculator

Try the interactive BaZi calculator: [tanchunsiong.github.io/fengshui-cli/bazi.html](https://tanchunsiong.github.io/fengshui-cli/bazi.html)

### Programmatic Usage

```javascript
const { calculateBaZi, getBaZiJSON } = require('fengshui-cli/bazi');

// Calculate BaZi
const bazi = calculateBaZi(1990, 5, 15, 14, 30);
console.log(bazi.dayMaster.stem);      // "庚"
console.log(bazi.dayMaster.info.english);  // "Yang Metal"
console.log(bazi.elements);            // { Wood: 0, Fire: 2, ... }

// JSON format for API
const json = getBaZiJSON(1990, 5, 15, 14, 30);
```

### Output Example

```
╔══════════════════════════════════════════════╗
║  📅 2026-02-14 (Saturday)                    ║
║  🌙 农历 2026年正月廿七                       ║
╠══════════════════════════════════════════════╣
║  干支 丙午年 庚寅月 壬子日                    ║
║  生肖 马 (Year of the Horse)                 ║
╠══════════════════════════════════════════════╣
║  🔥 日元素 Day Element: Water                ║
║  纳音: 桑柘木                                 ║
╠══════════════════════════════════════════════╣
║  ✅ 宜 (Auspicious):                          ║
║     祭祀, 祈福, 求嗣, 出行, 解除             ║
║  ❌ 忌 (Avoid):                               ║
║     嫁娶, 入宅, 安葬, 动土                   ║
╠══════════════════════════════════════════════╣
║  😊 喜神 Joy God: 正南                       ║
║  💰 财神 Wealth God: 正南                    ║
║  🙏 福神 Fortune God: 东南                   ║
╚══════════════════════════════════════════════╝
```

## Programmatic Usage

```javascript
const { 
  getAlmanacData, 
  findAuspiciousDates,
  formatAlmanac 
} = require('fengshui-cli/lib');

// Get today's data
const today = getAlmanacData();
console.log(today.elements.dayElement);  // "Fire"
console.log(today.activities.yi);        // ["祭祀", "祈福", ...]
console.log(today.gods.caiShen.desc);    // "正南"

// Specific date
const valentines = getAlmanacData('2026-02-14');

// Find auspicious dates
const weddingDates = findAuspiciousDates('嫁娶', 30);
// Returns array of dates where wedding is auspicious
```

## 🌐 Web Demo & Widget

**Live Demo:** [tanchunsiong.github.io/fengshui-cli](https://tanchunsiong.github.io/fengshui-cli)

### Embeddable Widget

A compact, stylish widget you can embed on any website:

```html
<iframe 
  src="https://tanchunsiong.github.io/fengshui-cli/widget.html" 
  width="340" 
  height="300" 
  frameborder="0"
  style="border-radius: 12px;">
</iframe>
```

### Build Your Own

Generate fresh static pages with today's data:

```bash
node build-web.js
```

This updates `docs/index.html` and `docs/widget.html` with the current almanac. Run daily via cron for a self-updating site.

---

## API Server

Start a JSON API for web/mobile apps:

```bash
fengshui server 3888
```

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | API documentation |
| `GET /today` | Today's almanac |
| `GET /date/YYYY-MM-DD` | Specific date |
| `GET /range/start/end` | Date range (max 90 days) |
| `GET /find/:activity` | Find auspicious dates |
| `GET /post/:platform` | Social media post |
| `GET /image` | Image generation data |
| `GET /bazi/YYYY-MM-DD` | BaZi chart (noon default) |
| `GET /bazi/YYYY-MM-DD/HH:MM` | BaZi with birth time |

### Example Response

```bash
curl http://localhost:3888/today
```

```json
{
  "solar": {
    "date": "2026-02-02",
    "weekdayEn": "Monday"
  },
  "lunar": {
    "ganZhiYear": "乙巳",
    "ganZhiDay": "庚午",
    "zodiac": "蛇",
    "zodiacEn": "Snake"
  },
  "elements": {
    "dayElement": "Fire",
    "dayNaYin": "路旁土"
  },
  "activities": {
    "yi": ["祭祀", "祈福", ...],
    "ji": ["动土", "安葬", ...]
  }
}
```

## Common Activities (宜忌)

| Chinese | English | Description |
|---------|---------|-------------|
| 嫁娶 | Wedding | Marriage ceremonies |
| 祈福 | Praying | Religious ceremonies |
| 出行 | Traveling | Trips and journeys |
| 开市 | Business | Opening a business |
| 入宅 | Moving | Moving into new home |
| 动土 | Construction | Breaking ground |
| 安葬 | Burial | Funeral services |
| 纳财 | Wealth | Collecting money |

## Use Cases

- **Feng Shui Websites** - Provide daily almanac to visitors
- **Wedding Planning Apps** - Find auspicious wedding dates
- **Mobile Apps** - Chinese calendar integration
- **Astrology Services** - Traditional Chinese calendar data
- **Cultural Education** - Learn about traditional Chinese customs

## Technical Details

Uses [lunar-typescript](https://github.com/6tail/lunar-typescript) for accurate traditional Chinese calendar calculations including:

- 干支 (Gan Zhi) stem-branch system
- 五行 (Wu Xing) five elements
- 纳音 (Na Yin) sound elements
- 宜忌 (Yi Ji) auspicious/inauspicious activities
- 神位 (Shen Wei) deity directions
- 节气 (Jie Qi) solar terms
- 彭祖百忌 (Peng Zu) classical taboos

## License

MIT License - Free for personal and commercial use.

## Links

- 🌐 Website: [chunfengshui.com](https://chunfengshui.com)
- 📦 npm: [npmjs.com/package/fengshui-cli](https://npmjs.com/package/fengshui-cli)
- 🐙 GitHub: [github.com/tanchunsiong/fengshui-cli](https://github.com/tanchunsiong/fengshui-cli)

---

Built with 💠 by [Cortana](https://github.com/tanchunsiong) @ [OpenClaw](https://openclaw.ai)
