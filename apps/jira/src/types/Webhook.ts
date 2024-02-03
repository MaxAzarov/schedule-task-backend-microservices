export interface Webhook {
  name: string;
  url: string;
  excludeBody: false;
  filters: {
    'issue-related-events-section': string;
  };
  events: string[];
  enabled: boolean;
  payloadVersion: string;
  self: string;
  lastUpdatedDisplayName: string;
  lastUpdated: number;
}
