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
  console.log(`Setting slackMessageTs to: ${result.ts}`);
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
      if (isUpdate) {
        console.log("Performing message update");
        await updateBuildStatusMessage();
      }
      else {
        console.log("Creating CI status message");
        await createBuildStatusMessage();
      }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
