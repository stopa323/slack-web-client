# Slack Web API Action
[Slack Web API](https://api.slack.com/web) wrapped in Github Action.

## Setup
Action requires slack bot token - follow [this](https://api.slack.com/start) instruction to get one.

## Usage
Send a simple text message to a channel.
```
- name: Simple Slack message                    
  uses: stopa323/slack-web-client@v1.0
  with:
    slackToken: ${{ secrets.SLACK_BOT_TOKEN }}
    slackMethodArgs: |
      {
        "channel": "pkw",
        "text": "Cos sie... cos sie popsulo..."
      }
```

The `slackMethodArgs` parameter expects a string in the JSON format. 

The `slackAPIMethod` parameter can be used to change default api method [chat.postMessage](https://api.slack.com/methods/chat.postMessage) to any suported by the [`@slack/web-api`](https://slack.dev/node-slack-sdk/web-api) package:

```
- name: Update message                   
  uses: stopa323/slack-web-client@v1.0
  with:
    slackToken: ${{ secrets.SLACK_BOT_TOKEN }}
    slackAPIMethod: chat.update
    slackMethodArgs: |
      {
        "channel": "pkw",
        "ts": "0123456789.000000",
        "text": "Powtarzam jeszcze raz"
      }
```

Action results can be accessed via `slackMethodResults` output:
```
jobs:
  createSlackMessage:
    name: Create CI status Slack message
    runs-on: ubuntu-latest
    outputs:
      slackMessageTs: ${{ fromJson(steps.create_message.outputs.slackMethodResults).ts }}
    steps:
      - name: Create message
        uses: stopa323/slack-web-client@v1.0
        id: create_message
        with:
          slackToken: ${{ secrets.SLACK_BOT_TOKEN }}
          slackMethodArgs: |
            {
              "channel": "ci",
              "text": "Build #2137 started..."
            }
  runTests:
    name: Run pytest
    runs-on: ubuntu-latest
    needs: createSlackMessage
    steps:
      ...
      - name: Update message with status
        uses: stopa323/slack-web-client@v1.0
        with:
          slackToken: ${{ secrets.SLACK_BOT_TOKEN }}
          slackAPIMethod: chat.update
          slackMethodArgs: |
            {
              "channel": "C01667Y1K8U",
              "ts": "${{ needs.createSlackMessage.outputs.slackMessageTs }}",
              "text": "Build #2137 failed"
            }
```

## Credits
Based on [hbfernandes/slack-action](https://github.com/hbfernandes/slack-action)
