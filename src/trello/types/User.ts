import { GeneralStatus } from './GeneralStatus';

export interface User {
  id: string;
  aaId: string;
  activityBlocked: false;
  avatarHash: string;
  avatarUrl: string;
  bio: string;
  bioData: unknown;
  confirmed: true;
  fullName: string;
  idEnterprise: unknown;
  idEnterprisesDeactivated: [];
  idMemberReferrer: unknown;
  idPremOrgsAdmin: [];
  initials: string;
  memberType: string; // 'normal'
  nonPublic: unknown;
  nonPublicAvailable: true;
  products: [];
  url: string;
  username: string;
  status: string; // 'disconnected'
  aaBlockSyncUntil: null;
  aaEmail: null;
  aaEnrolledDate: null;
  avatarSource: string;
  credentialsRemovedCount: 0;
  domainClaimed: null;
  email: null;
  gravatarHash: string;
  idBoards: string[];
  idOrganizations: string[];
  idEnterprisesAdmin: [];
  idEnterprisesImplicitAdmin: [];
  limits: {
    boards: { totalPerMember: GeneralStatus };
    orgs: { totalPerMember: GeneralStatus };
  };
  loginTypes: null;
  marketingOptIn: { optedIn: true; date: '2022-03-07T10:38:10.309Z' };
  messagesDismissed: [];
  oneTimeMessagesDismissed: string[];
  prefs: {
    privacy: { fullName: 'public'; avatar: 'public' };
    sendSummaries: true;
    minutesBetweenSummaries: 60;
    minutesBeforeDeadlineToNotify: 1440;
    colorBlind: false;
    locale: 'en-US';
  };
  trophies: [];
  uploadedAvatarHash: string;
  uploadedAvatarUrl: string;
  premiumFeatures: string[];
  isAaMastered: boolean;
  ixUpdate: string;
  active: boolean;
  requiresAaOnboarding: unknown;
}
