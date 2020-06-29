const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackToken');
const client = new WebClient(token);

// async function createBuildStatusMessage() {
//   console.log("Creating new Slack message");
//
//   const result = await client.chat.postMessage({
//     channel: channel,
//     text: messageContent
//   });
//   console.log(`Setting slackMessageTs to: ${result.ts}`);
//   core.setOutput("slackMessageTs", result.ts);
// }

// async function updateBuildStatusMessage() {
//   console.log(`Updating Slack message: ${process.env.MESSAGE_TS}`);
//
//   const result = await client.chat.update({
//     channel: channel,
//     ts: process.env.MESSAGE_TS,
//     text: messageContent
//   });
// }

async function run() {
  try {
    const args = JSON.parse(core.getInput("slackMethodArgs"));
    const method = core.getInput("slackAPIMethod").split(".");

    let webAPIMethod = client;
    method.forEach(methodPart => {
      if (webAPIMethod[methodPart]) {
        webAPIMethod = webAPIMethod[methodPart];
      }
      else {
        core.setFailed(`Method '${method}' does not exist`)
      }
    })
    const result = await webAPIMethod(args);
    console.log(result);
    core.setOutput("results", result);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
