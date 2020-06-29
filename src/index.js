const { WebClient } = require('@slack/web-api');

const core = require('@actions/core');

const token = core.getInput('slackToken');
const client = new WebClient(token);


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
    core.setOutput("slackMethodResults", result);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
