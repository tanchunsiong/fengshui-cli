#!/usr/bin/env node
/**
 * Build script for fengshui-cli web page
 * Injects today's almanac data into the static HTML
 * Run daily via cron to keep the page fresh
 */

const fs = require('fs');
const path = require('path');
const { getAlmanacData } = require('./lib');

async function build() {
    console.log('🔨 Building fengshui web pages...\n');
    
    // Get today's almanac
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Fetching almanac for ${today}...`);
    const data = await getAlmanacData(today);
    const dataJson = JSON.stringify(data, null, 2);
    
    // Build main page
    const indexTemplate = path.join(__dirname, 'templates', 'index.html');
    const indexOutput = path.join(__dirname, 'docs', 'index.html');
    
    // Check if template exists, otherwise use docs as template
    let indexHtml;
    if (fs.existsSync(indexTemplate)) {
        indexHtml = fs.readFileSync(indexTemplate, 'utf8');
    } else {
        indexHtml = fs.readFileSync(indexOutput, 'utf8');
        // Save as template if it has placeholder
        if (indexHtml.includes('ALMANAC_PLACEHOLDER')) {
            fs.mkdirSync(path.join(__dirname, 'templates'), { recursive: true });
            fs.writeFileSync(indexTemplate, indexHtml);
        }
    }
    
    indexHtml = indexHtml.replace('ALMANAC_PLACEHOLDER', dataJson);
    fs.writeFileSync(indexOutput, indexHtml);
    console.log(`✅ Built: ${indexOutput}`);
    
    // Build widget page
    const widgetTemplate = path.join(__dirname, 'templates', 'widget.html');
    const widgetOutput = path.join(__dirname, 'docs', 'widget.html');
    
    let widgetHtml;
    if (fs.existsSync(widgetTemplate)) {
        widgetHtml = fs.readFileSync(widgetTemplate, 'utf8');
    } else {
        widgetHtml = fs.readFileSync(widgetOutput, 'utf8');
        if (widgetHtml.includes('WIDGET_PLACEHOLDER')) {
            fs.mkdirSync(path.join(__dirname, 'templates'), { recursive: true });
            fs.writeFileSync(widgetTemplate, widgetHtml);
        }
    }
    
    widgetHtml = widgetHtml.replace('WIDGET_PLACEHOLDER', dataJson);
    fs.writeFileSync(widgetOutput, widgetHtml);
    console.log(`✅ Built: ${widgetOutput}`);
    
    console.log(`\n📊 Today's element: ${data.elements.dayElement} (${data.elements.dayNaYin})`);
    console.log(`🐲 Year: ${data.lunar.ganZhiYear} (${data.lunar.zodiacEn})`);
    
    return data;
}

// Run if called directly
if (require.main === module) {
    build().catch(err => {
        console.error('❌ Build failed:', err.message);
        process.exit(1);
    });
}

module.exports = { build };
