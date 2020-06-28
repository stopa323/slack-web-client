const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

(async () => {
  const result = await client.chat.postMessage({
    channel: channel,
    text: 'Build in progress',
  });

  console.log(`Posted message ${result.ts} to ${channel}`);
})();
