import { Card } from './Card';

export interface WebhookCallback {
  model: Card;
  action: {
    id: '63fb135dacabe8a8ced37986';
    idMemberCreator: '6225e091c4be504f037de781';
    data: {
      card: {
        name: string;
        id: string;
        idShort: number;
        shortLink: string;
      };
      old: { name: string };
      board: { id: string; name: string; shortLink: string };
      list: { id: string; name: string };
    };
    appCreator: null;
    type: string; // 'updateCard';
    date: string;
    limits: null;
    display: { translationKey: string; entities: unknown };
    memberCreator: {
      id: string;
      activityBlocked: boolean;
      avatarHash: string;
      avatarUrl: string;
      fullName: string;
      idMemberReferrer: unknown;
      initials: string;
      nonPublic: unknown;
      nonPublicAvailable: boolean;
      username: string;
    };
  };
}
