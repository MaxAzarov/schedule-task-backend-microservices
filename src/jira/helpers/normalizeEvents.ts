import { Event } from 'src/common/types';
import { Issue } from '../types/Issues';
import { IntegrationType } from 'src/integrations/types';

export function normalizeJiraEvents(events: Issue[]): Event[] {
  return events.map((event) => {
    return {
      title: event.fields.summary,
      resource: { ...event, type: IntegrationType.jira },
      allDay: event.fields.duedate === null,
      start: event.fields.customfield_10015
        ? new Date(event.fields.customfield_10015)
        : new Date(),
      end: event.fields.duedate ? new Date(event.fields.duedate) : new Date(),
    };
  });
}
