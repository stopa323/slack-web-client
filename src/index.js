const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackBotToken');
const channel = core.getInput('slackChannel');

const client = new WebClient(token);

async function post() {
  console.log(`post function`);
}

async function main() {
  console.log(`main function`);
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

  // const result = await client.chat.postMessage({
  //   channel: channel,
  //   text: 'Build in progress',
  // });
