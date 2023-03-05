import { Issue } from './Issues';
import { UserDetails } from './UserInfo';

export interface WebhookCallback {
  timestamp: string;
  webhookEvent: string;
  issue_event_type_name: string;
  user: UserDetails;
  issue: Issue;
  changelog: {
    id: string;
    items: {
      field: string;
      fieldtype: string;
      fieldId: string;
      from: null;
      fromString: string;
      to: null;
      toString: string;
    }[];
  };
}
