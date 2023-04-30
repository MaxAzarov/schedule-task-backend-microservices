export type ExpressUser = Pick<AppUser, 'id' | 'role' | 'email'>;

export interface Event {
  allDay?: boolean | undefined;
  title: string;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
}
