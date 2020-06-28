const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

async function postMessage() {
  const result = await client.chat.postMessage({
    channel: channel,
    text: 'Build started'
  });
  core.exportVariable('MESSAGE_TS', result.ts);
}

async function updateMessage(ts) {
  const result = await client.chat.update({
    channel: channel,
    ts: ts,
    text: 'Build finished'
  });
}

async function run() {
  try {
      var ts = process.env.MESSAGE_TS || "";
      console.log(ts);
      if ("" == ts) {
        await postMessage();
      }
      else {
        await updateMessage(ts);
      }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
