const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

async function createBuildStatusMessage() {
  const result = await client.chat.postMessage({
    channel: channel,
    text: 'Build started'
  });
  core.setOutput("slackMessageTs", result.ts);
}

async function updateBuildStatusMessage() {
  console.log(process.env.MESSAGE_TS)
  const result = await client.chat.update({
    channel: channel,
    ts: process.env.MESSAGE_TS,
    text: 'Build finished'
  });
}

async function run() {
  try {
      const isUpdate = core.getInput("messageUpdate");
      console.log(isUpdate);
      if (isUpdate) {
        await updateBuildStatusMessage();
      }
      else {
        await createBuildStatusMessage();
      }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
