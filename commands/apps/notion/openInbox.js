#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Notion - Inbox
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/icon-notion.png
// @raycast.packageName Raycast Scripts
// @raycast.description Navigate to notion pages

// to enable command:
// 1. cd `_enabled-commands` && npm i -S dotenv
// 2. touch `_enabled-commands/.env`
// 3. cp this file to `_enabled-commands`

require('dotenv').config();

const path = require('path');
const { openNotionPage } = require(path.join(
  process.env.NOTION_PROJ_ROOT,
  '_utils',
));

async function main() {
  try {
    await openNotionPage(process.env.NOTION_INBOX);
  } catch (err) {
    console.error(err);
  }
}

main();
