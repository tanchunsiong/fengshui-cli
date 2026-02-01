#!/usr/bin/env node
/**
 * fengshui-cli API Server
 * Simple HTTP JSON API for Chinese Almanac data
 * 
 * Usage: node server.js [port]
 * Default port: 3888
 */

const http = require('http');
const url = require('url');
const lib = require('./lib');

const PORT = process.env.PORT || process.argv[2] || 3888;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function sendJSON(res, data, status = 200) {
  res.writeHead(status, CORS_HEADERS);
  res.end(JSON.stringify(data, null, 2));
}

function sendError(res, message, status = 400) {
  sendJSON(res, { error: message }, status);
}

const routes = {
  '/': (req, res) => {
    sendJSON(res, {
      name: 'fengshui-cli API',
      version: '1.0.0',
      endpoints: {
        '/': 'This help',
        '/today': 'Today\'s almanac',
        '/date/:YYYY-MM-DD': 'Almanac for specific date',
        '/range/:start/:end': 'Almanac for date range',
        '/find/:activity': 'Find auspicious dates for activity',
        '/post/:platform': 'Social media post (twitter/general)',
        '/image': 'Image generation data'
      },
      example: '/date/2026-02-14'
    });
  },
  
  '/today': (req, res) => {
    const data = lib.getAlmanacData();
    sendJSON(res, data);
  },
  
  '/image': (req, res) => {
    const data = lib.getAlmanacData();
    sendJSON(res, lib.generateImageData(data));
  }
};

function handleRequest(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Static routes
  if (routes[path]) {
    return routes[path](req, res);
  }
  
  // /date/YYYY-MM-DD
  const dateMatch = path.match(/^\/date\/(\d{4}-\d{2}-\d{2})$/);
  if (dateMatch) {
    try {
      const data = lib.getAlmanacData(dateMatch[1]);
      return sendJSON(res, data);
    } catch (e) {
      return sendError(res, 'Invalid date format');
    }
  }
  
  // /range/start/end
  const rangeMatch = path.match(/^\/range\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/);
  if (rangeMatch) {
    const start = rangeMatch[1];
    const end = rangeMatch[2];
    const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    
    if (days > 90) {
      return sendError(res, 'Range too large (max 90 days)');
    }
    
    const data = lib.getAlmanacRange(start, end);
    return sendJSON(res, { count: data.length, dates: data });
  }
  
  // /find/activity
  const findMatch = path.match(/^\/find\/(.+)$/);
  if (findMatch) {
    const activity = decodeURIComponent(findMatch[1]);
    const days = parseInt(query.days) || 30;
    const data = lib.findAuspiciousDates(activity, Math.min(days, 90));
    return sendJSON(res, { 
      activity, 
      searchDays: days,
      found: data.length, 
      dates: data 
    });
  }
  
  // /post/platform
  const postMatch = path.match(/^\/post\/(\w+)$/);
  if (postMatch) {
    const platform = postMatch[1];
    const dateStr = query.date;
    const data = dateStr ? lib.getAlmanacData(dateStr) : lib.getAlmanacData();
    const post = lib.generateSocialPost(data, { platform });
    return sendJSON(res, { platform, date: data.solar.date, post });
  }
  
  // 404
  sendError(res, 'Not found. Try / for API docs.', 404);
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
🔮 fengshui-cli API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━

Listening on http://localhost:${PORT}

Endpoints:
  GET /           API documentation
  GET /today      Today's almanac
  GET /date/YYYY-MM-DD   Specific date
  GET /range/start/end   Date range (max 90 days)
  GET /find/activity     Find auspicious dates
  GET /post/twitter      Social media post
  GET /image             Image generation data

Press Ctrl+C to stop
`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close(() => process.exit(0));
});
