import { Project } from './Project';

export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    statuscategorychangedate: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      entityId: string;
      hierarchyLevel: number;
    };
    timespent: null;
    customfield_10030: null;
    customfield_10031: null;
    project: Omit<
      Project,
      | 'projectTypeKey'
      | 'style'
      | 'isPrivate'
      | 'properties'
      | 'entityId'
      | 'uuid'
    >;
    fixVersions: [];
    aggregatetimespent: null;
    resolution: null;
    customfield_10027: null;
    customfield_10028: null;
    customfield_10029: null;
    resolutiondate: null;
    workratio: -1;
    watches: {
      self: string;
      watchCount: 1;
      isWatching: true;
    };
    lastViewed: null;
    created: '2023-03-02T19:53:34.840+0200';
    customfield_10020: null;
    customfield_10021: null;
    customfield_10022: null;
    priority: {
      self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/priority/3';
      iconUrl: 'https://maksym-azarov.atlassian.net/images/icons/priorities/medium.svg';
      name: 'Medium';
      id: '3';
    };
    customfield_10023: null;
    customfield_10024: null;
    customfield_10025: null;
    labels: [];
    customfield_10026: null;
    customfield_10016: null;
    customfield_10017: null;
    customfield_10018: {
      hasEpicLinkFieldDependency: false;
      showField: false;
      nonEditableReason: {
        reason: 'PLUGIN_LICENSE_ERROR';
        message: 'The Parent Link is only available to Jira Premium users.';
      };
    };
    customfield_10019: '0|i0000f:';
    timeestimate: null;
    aggregatetimeoriginalestimate: null;
    versions: [];
    issuelinks: [];
    assignee: null;
    updated: '2023-03-02T19:53:36.990+0200';
    status: {
      self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/status/10002';
      description: '';
      iconUrl: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/';
      name: 'Done';
      id: '10002';
      statusCategory: {
        self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/statuscategory/3';
        id: 3;
        key: 'done';
        colorName: 'green';
        name: 'Done';
      };
    };
    components: [];
    timeoriginalestimate: null;
    description: null;
    customfield_10010: null;
    customfield_10014: null;
    customfield_10015: string | null;
    customfield_10005: null;
    customfield_10006: null;
    customfield_10007: null;
    security: null;
    customfield_10008: null;
    aggregatetimeestimate: null;
    customfield_10009: null;
    // name of issue
    summary: string;
    creator: {
      self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/user?accountId=5dd70c059d79ad0ef53a42b1';
      accountId: '5dd70c059d79ad0ef53a42b1';
      emailAddress: 'volodor05412@gmail.com';
      avatarUrls: {
        '48x48': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '24x24': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '16x16': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '32x32': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
      };
      displayName: 'Максим Азаров';
      active: true;
      timeZone: 'Europe/Kiev';
      accountType: 'atlassian';
    };
    subtasks: [];
    reporter: {
      self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/user?accountId=5dd70c059d79ad0ef53a42b1';
      accountId: '5dd70c059d79ad0ef53a42b1';
      emailAddress: 'volodor05412@gmail.com';
      avatarUrls: {
        '48x48': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '24x24': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '16x16': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
        '32x32': 'https://secure.gravatar.com/avatar/29f1e75d43a9669b90a2eacf6688aa70?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Fdefault-avatar-4.png';
      };
      displayName: 'Максим Азаров';
      active: true;
      timeZone: 'Europe/Kiev';
      accountType: 'atlassian';
    };
    aggregateprogress: { progress: 0; total: 0 };
    customfield_10001: null;
    customfield_10002: null;
    customfield_10003: null;
    customfield_10004: null;
    environment: null;
    duedate: null;
    progress: { progress: 0; total: 0 };
    votes: {
      self: 'https://api.atlassian.com/ex/jira/d28655b1-b6d5-4da7-b216-79f2c35c6efc/rest/api/3/issue/FIRST-3/votes';
      votes: 0;
      hasVoted: false;
    };
  };
}

export interface IssuesPaginated {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: Issue[];
}
