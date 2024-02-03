import { GeneralStatus } from './GeneralStatus';

export interface Board {
  id: string;
  nodeId: string;
  name: string;
  desc: string;
  descData: unknown;
  closed: boolean;
  dateClosed: unknown;
  idOrganization: string;
  idEnterprise: unknown;
  limits: {
    attachments: {
      perBoard: GeneralStatus;
      perCard: GeneralStatus;
    };
    boards: {
      totalMembersPerBoard: GeneralStatus;
      totalAccessRequestsPerBoard: {
        status: 'ok';
        disableAt: 4000;
        warnAt: 3200;
      };
    };
    cards: {
      openPerBoard: GeneralStatus;
      openPerList: GeneralStatus;
      totalPerBoard: GeneralStatus;
      totalPerList: GeneralStatus;
    };
    checklists: {
      perBoard: GeneralStatus;
      perCard: GeneralStatus;
    };
    checkItems: { perChecklist: GeneralStatus };
    customFields: { perBoard: GeneralStatus };
    customFieldOptions: {
      perField: GeneralStatus;
    };
    labels: { perBoard: GeneralStatus };
    lists: {
      openPerBoard: GeneralStatus;
      totalPerBoard: GeneralStatus;
    };
    stickers: { perCard: GeneralStatus };
    reactions: {
      perAction: GeneralStatus;
      uniquePerAction: GeneralStatus;
    };
  };
  pinned: boolean;
  starred: boolean;
  url: string;
  prefs: {
    permissionLevel: 'org';
    hideVotes: false;
    voting: 'disabled';
    comments: 'members';
    invitations: 'members';
    selfJoin: true;
    cardCovers: true;
    isTemplate: false;
    cardAging: 'regular';
    calendarFeedEnabled: false;
    hiddenPluginBoardButtons: [];
    switcherViews: {
      _id: string;
      viewType:
        | 'Board'
        | 'Table'
        | 'Calendar'
        | 'Dashboard'
        | 'Timeline'
        | 'Map';
      enabled: boolean;
      typeName: 'SwitcherViews';
      id: string;
    }[];
    background: string;
    backgroundColor: null;
    backgroundImage: string;
    backgroundImageScaled: { width: number; height: number; url: string }[];
    backgroundTile: false;
    backgroundBrightness: 'dark';
    backgroundBottomColor: '#293330';
    backgroundTopColor: '#eef3f7';
    canBePublic: true;
    canBeEnterprise: true;
    canBeOrg: true;
    canBePrivate: true;
    canInvite: true;
  };
  shortLink: string;
  subscribed: boolean;
  labelNames: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
    purple: string;
    blue: string;
    sky: string;
    lime: string;
    pink: string;
    black: string;
    green_dark: string;
    yellow_dark: string;
    orange_dark: string;
    red_dark: string;
    purple_dark: string;
    blue_dark: string;
    sky_dark: string;
    lime_dark: string;
    pink_dark: string;
    black_dark: string;
    green_light: string;
    yellow_light: string;
    orange_light: string;
    red_light: string;
    purple_light: string;
    blue_light: string;
    sky_light: string;
    lime_light: string;
    pink_light: string;
    black_light: string;
  };
  powerUps: [];
  dateLastActivity: string;
  dateLastView: string;
  shortUrl: string;
  idTags: [];
  datePluginDisable: null;
  creationMethod: null;
  ixUpdate: '975';
  templateGallery: null;
  enterpriseOwned: false;
  idBoardSource: null;
  premiumFeatures: string[];
  idMemberCreator: string;
  memberships: {
    idMember: string;
    memberType: 'admin' | 'type';
    unconfirmed: boolean;
    deactivated: boolean;
    id: string;
  }[];
}
