import { SmartThingsClient, BearerTokenAuthenticator, DeviceListOptions } from "@smartthings/core-sdk";
import { WebClient } from '@slack/web-api';
import NLP from "../nlp/nlp";
import strings from "../localization/strings";

const { SCENE_LIGHTS_OFF } = process.env;

/**
 * Slack message handler
 */
export default class SlackMessageHandler {

  private channel: string;
  private slackToken: string;
  private smartThingsToken: string;
  private _slackClient?: WebClient;
  private _smartThingsClient?: SmartThingsClient;

  /**
   * Constructor
   * 
   * @param channel Slack channel
   * @param slackToken Slack access token
   * @param smartThingsToken SmartThings token
   */
  constructor(channel: string, slackToken: string, smartThingsToken: string) {
    this.channel = channel;
    this.slackToken = slackToken;
    this.smartThingsToken = smartThingsToken;
  }

  /**
   * Handles incoming Slack event
   * 
   * @param message message
   */
  public handleMessage = async (message: string) => {
    const nlp = new NLP();
    const nlpResuilt = await nlp.process(message);

    const { intent, locale } = nlpResuilt;
    
    if (intent === "None") {
      return;
    }
            
    strings.setLanguage(locale);

    try {
      switch (intent) {
        case "lights.status":
          return await this.handleLightsStatusMessage();
        case "lights.off":
          return await this.handleLightsOffMessage();
      }
    } catch (e) {
      await this.sendSlackMessage(`Error: ${e.message}`);
    }
  }

  /**
   * Handles light status event
   */
  private handleLightsStatusMessage = async () => {
    await this.sendSlackMessage(strings.slackbot.lightStatus.checking);

    const lights = await this.smartThingsClient.devices.list({
      capability: "light"
    });

    const lightsOff = [];
    const lightsOn = [];

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      if (light.deviceId) {
        const status = await this.smartThingsClient.devices.getStatus(light.deviceId);
        if (status?.components?.main?.light?.switch?.value === "on") {
          lightsOn.push(light);
        } else {
          lightsOff.push(light);
        }
      }
    }
    
    const lightsOnNames = lightsOn.map(device => device.name).join(", ");
        
    await this.sendSlackMessage(strings.formatString(strings.slackbot.lightStatus.lightsOn, lightsOn.length.toString(), lightsOnNames) as string);
    await this.sendSlackMessage(strings.formatString(strings.slackbot.lightStatus.lightsOff, lightsOff.length.toString()) as string);
  }

  /**
   * Handles lights off message
   */
  private handleLightsOffMessage = async () => {
    if (!SCENE_LIGHTS_OFF) {
      await this.sendSlackMessage(strings.slackbot.lightsOff.noSceneId);
      return;
    }

    await this.sendSlackMessage(strings.slackbot.lightsOff.turningOff);
    await this.smartThingsClient.scenes.execute(SCENE_LIGHTS_OFF);
    await this.sendSlackMessage(strings.slackbot.lightsOff.lightsAreOff); 
  }

  /**
   * Private sends a slack message
   * 
   * @param message message
   * @returns Slack response
   */
  private sendSlackMessage = async (message: string) => {
    const result = await this.slackClient.chat.postMessage({
      channel: this.channel,
      text: message
    });

    if (!result.ok) {
      console.error("Failed to send the slack message", result);
    }

    return result;
  }

  /**
   * Returns Slack client
   * 
   * @returns Slack client
   */
  private get slackClient() {
    if (!this._slackClient) {
      this._slackClient = new WebClient(this.slackToken);
    }

    return this._slackClient;
  }

  /**
   * Returns SmartThings client
   * 
   * @returns SmartThings client
   */
  private get smartThingsClient() {
    if (!this._smartThingsClient) {
      this._smartThingsClient = new SmartThingsClient(new BearerTokenAuthenticator(this.smartThingsToken));
    }

    return this._smartThingsClient;
  }

}