const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

async function post() {
  var ts = core.getState("message.ts");
  const result = await client.chat.update({
    channel: channel,
    ts: ts,
    text: 'updated you'
  });
}

async function main() {
  const result = await client.chat.postMessage({
    channel: channel,
    text: 'Build started'
  });

  core.saveState("message.ts", result.ts);
}

async function run() {
  try {
      var stage = core.getState("actionStage");
      if ("post" == stage) {
        await post();
      }
      else {
        await main();
        core.saveState("actionStage", "post");
      }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
