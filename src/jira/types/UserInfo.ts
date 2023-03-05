export interface UserInfo {
  id: string;
  url: string;
  name: string;
  scopes: string[];
  avatarUrl: string;
}

export interface UserDetails {
  self: string;
  accountId: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  displayName: string;
  active: boolean;
  timeZon: string;
  accountType: string; // ? 'atlassian'
}
