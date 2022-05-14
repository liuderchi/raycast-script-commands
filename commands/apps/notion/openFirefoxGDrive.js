#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Firefox - Google Drive
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/icon-firefox.png
// @raycast.packageName Raycast Scripts
// @raycast.description Navigate to Firefox Gmail

// to enable command:
// 1. cd `_enabled-commands` && npm i -S dotenv
// 2. touch `_enabled-commands/.env`
// 3. cp this file to `_enabled-commands`

require('dotenv').config();

const path = require('path');
const { openFirefoxPage } = require(path.join(
  process.env.NOTION_PROJ_ROOT,
  '_utils',
));

async function main() {
  try {
    await openFirefoxPage('https://drive.google.com/drive/');
  } catch (err) {
    console.error(err);
  }
}

main();
