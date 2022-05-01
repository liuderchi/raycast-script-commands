#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Notion - Shop List
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/notion-icon.png
// @raycast.packageName Raycast Scripts
// @raycast.description Navigate to notion pages

// to enable command:
// 1. cd `_enabled-commands` && npm i -S dotenv
// 2. touch `_enabled-commands/.env`
// 3. cp this file to `_enabled-commands`

require('dotenv').config();
const REPO_NAME = 'raycast-script-commands';

const os = require('os');
const path = require('path');
const { openNotionPage } = require(path.join(
  os.homedir(),
  REPO_NAME,
  'commands/apps/notion/_utils',
));

async function main() {
  try {
    await openNotionPage(process.env.NOTION_SHOP_LIST);
  } catch (err) {
    console.error(err);
  }
}

main();
