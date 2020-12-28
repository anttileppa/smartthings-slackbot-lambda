import { SlackEvent } from "./slack/slack-event";
import SlackEventHandler from "./slack/slack-event-handler";
import { Response } from "./types";

const { SLACK_BOT_TOKEN , SMARTTHINGS_PERSONAL_ACCESS_TOKEN} = process.env;

/**
 * Lambda entrypoint
 */
exports.handler = async (opts: {body: string, headers: { [key: string]: string } }): Promise<Response> => {  
  if (!SLACK_BOT_TOKEN || !SMARTTHINGS_PERSONAL_ACCESS_TOKEN) {
    console.error("Missing SLACK_BOT_TOKEN or SMARTTHINGS_PERSONAL_ACCESS_TOKEN");
    return {
      statusCode: 500,
      body: "Missing SLACK_BOT_TOKEN or SMARTTHINGS_PERSONAL_ACCESS_TOKEN"
    };
  }

  const { body, headers } = opts;
  if (headers["X-Slack-Retry-Num"]) {
    return {
      statusCode: 200
    };
  }

  const event = JSON.parse(body) as SlackEvent;
  
  try {
    const eventHandler = new SlackEventHandler(SLACK_BOT_TOKEN, SMARTTHINGS_PERSONAL_ACCESS_TOKEN);
    const response = await eventHandler.handle(event);
    console.log("response", response);
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message
    };
  } 
};
