export interface BaseEvent {
  allDay?: boolean | undefined;
  title: string;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
}

export enum EventType {
  Jira = 'jira',
  Trello = 'trello',
  Custom = 'custom',
}
