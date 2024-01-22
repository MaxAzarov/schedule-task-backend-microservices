import { Event as BaseEvent, EventType } from '@app/common';
import { Issue } from '../types/Issues';

export function normalizeJiraEvents(events: Issue[]): BaseEvent[] {
  return events.map((event) => {
    return {
      title: event.fields.summary,
      resource: { ...event, type: EventType.Jira },
      allDay: event.fields.duedate === null,
      start: event.fields.customfield_10015
        ? new Date(event.fields.customfield_10015)
        : new Date(),
      end: event.fields.duedate ? new Date(event.fields.duedate) : new Date(),
    };
  });
}
