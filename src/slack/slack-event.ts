/**
 * Slack event type 
 */
export type EventType = "url_verification" | "event_callback";

/**
 * Slack callback event type
 */
export type EventCallbackType = "message";

/**
 * Abstract Slack event
 */
export interface AbstractSlackEvent {
  type: EventType;
  token: string;
}

/**
 * URL Verification Slack event
 */
export interface URLVerificationSlackEvent extends AbstractSlackEvent {
  type: "url_verification";
  challenge: string;
}

/**
 * Callback Slack event
 */
export interface EventCallbackSlackEvent extends AbstractSlackEvent {
  type: "event_callback";
  team_id: string;
  api_app_id: string;
  event: {
    bot_id?: string;
    bot_profile?: {
        id: string,
        deleted: boolean,
        name: string,
        updated: number,
        app_id: string,
        icons: {
            image_36: string;
            image_48: string;
            image_72: string;
        },
        team_id: string;
    },
    client_msg_id?: string;
    type: EventCallbackType;
    text: string;
    user: string;
    ts: string;
    team: string;
    blocks: [
      {
        type: string;
        block_id: string;
        elements: [
          {
            type: string;
            elements: [
              {
                type: string;
                text: string;
              }
            ]
          }
        ]
      }
    ],
    channel: string;
    event_ts: string;
    channel_type: string;
  },
  event_id: string;
  event_time: number;
  authorizations: [
    {
      enterprise_id: string;
      team_id: string;
      user_id: string;
      is_bot: true,
      is_enterprise_install: boolean;
    }
  ],
  is_ext_shared_channel: boolean;
  event_context: string;
}

/**
 * Composite type for Slack events
 */
export type SlackEvent = URLVerificationSlackEvent | EventCallbackSlackEvent;