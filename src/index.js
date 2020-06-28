const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

async function pre() {
  const result = await client.chat.postMessage({
    channel: channel,
    text: 'pre'
  });
  core.saveState("message.ts", result.ts);
}

async function post() {
  var ts = core.getState("message.ts");
  const result = await client.chat.update({
    channel: channel,
    ts: ts,
    text: 'post'
  });
}

async function main() {
  console.log("I do nothing");
}

async function run() {
  try {
      var stage = core.getState("actionStage");
      if ("main" == stage) {
        await main();
        core.saveState("actionStage", "post");
      }
      else if ("post" == stage) {
        await post();
      }
      else {
        await pre();
        core.saveState("actionStage", "main");
      }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
