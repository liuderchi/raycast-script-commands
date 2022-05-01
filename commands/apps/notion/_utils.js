// Notion utils

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function openNotionPage(pagePath) {
  try {
    const url = new URL(pagePath || '', 'notion://www.notion.so');
    await exec(`open "${url}"`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  openNotionPage,
};
