export interface Card {
  id: string;
  badges: {
    attachmentsByType: { trello: { board: number; card: number } };
    location: false;
    votes: number;
    viewingMemberVoted: false;
    subscribed: true;
    fogbugz: '';
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue: unknown;
    comments: number;
    attachments: number;
    description: false;
    due: string;
    dueComplete: false;
    start: string;
  };
  checkItemStates: unknown;
  closed: false;
  dueComplete: false;
  dateLastActivity: string;
  desc: string;
  descData: { emoji: unknown };
  due: string | null;
  dueReminder: unknown;
  email: unknown;
  idBoard: string;
  idChecklists: [];
  idList: string;
  idMembers: string[];
  idMembersVoted: [];
  idShort: number;
  idAttachmentCover: unknown;
  labels: { id: string; idBoard: string; name: string; color: string }[];
  idLabels: string[];
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start: string | null;
  subscribed: true;
  url: string;
  cover: {
    idAttachment: unknown;
    color: unknown;
    idUploadedBackground: unknown;
    size: string;
    brightness: string;
    idPlugin: unknown;
  };
  isTemplate: boolean;
  cardRole: unknown;
}
