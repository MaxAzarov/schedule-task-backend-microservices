import { Event } from 'src/common/types';
import { Issue } from '../types/Issues';

export function normalizeJiraEvents(events: Issue[]): Event[] {
  return events.map((event) => {
    return {
      title: event.key,
      //   allDay: event.due === null,
    };
  });
}
