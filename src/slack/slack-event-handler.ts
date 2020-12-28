import { Response } from "../types";
import { SlackEvent, URLVerificationSlackEvent, EventCallbackSlackEvent } from "./slack-event";
import SlackMessageHandler from "./slack-message-hander";

/**
 * Handler for Slack events
 */
export default class SlackEventHandler {

  private slackToken: string;
  private smartThingsToken: string;

  /**
   * Constructor
   * 
   * @param slackToken Slack access token
   * @param smartThingsToken SmartThings token
   */
  constructor(slackToken: string, smartThingsToken: string) {
    this.slackToken = slackToken;
    this.smartThingsToken = smartThingsToken;
  }

  /**
   * Handles a Slack event
   * 
   * @param event Slack event
   * @returns Lambda response
   */
  public handle = async (event: SlackEvent): Promise<Response> => {
    switch (event.type) {
      case 'event_callback':
        return await this.handleEventCallback(event);
      case "url_verification":
        return await this.handleUrlVerification(event);
      default:
        return {
          statusCode: 200
        };
    }
  }

  /**
   * Handles callback event
   * 
   * @param event Slack event
   * @returns Lambda response
   */
  private handleEventCallback = async (event: EventCallbackSlackEvent) => {
    switch (event.event.type) {
      case 'message':
        if (event.event.client_msg_id) {
          const message = event.event.text;
          const channel = event.event.channel;
          
          const messageHandler = new SlackMessageHandler(channel, this.slackToken, this.smartThingsToken);
          await messageHandler.handleMessage(message);
        }
    }

    return {
      statusCode: 200
    };
  }

  /**
   * Handles URL Verification event
   * 
   * @param event Slack event
   * @returns Lambda response
   */
  private handleUrlVerification = async (event: URLVerificationSlackEvent) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        challenge: event.challenge
      })
    };
  }

}