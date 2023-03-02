export interface ProjectDetails {
  expand: string;
  self: string;
  id: string;
  key: string;
  description: string;
  lead: {
    self: string;
    accountId: string;
    avatarUrls: {
      '48x48': string;
      '24x24': string;
      '16x16': string;
      '32x32': string;
    };
    displayName: string;
    active: true;
  };
  components: [];
  issueTypes: {
    self: string;
    id: string;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
    hierarchyLevel: number;
  }[];
  assigneeType: string;
  versions: [];
  name: string;
  roles: {
    'atlassian-addons-project-access': string;
    Administrator: string;
    Viewer: string;
    Member: string;
  };
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: unknown;
  entityId: string;
  uuid: string;
}
