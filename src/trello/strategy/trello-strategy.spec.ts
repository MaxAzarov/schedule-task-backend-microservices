import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TrelloStrategy } from './trello-strategy';

describe('TrelloStrategy', () => {
  let trelloStrategy: TrelloStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ConfigModule, TrelloStrategy],
    }).compile();

    trelloStrategy = module.get<TrelloStrategy>(TrelloStrategy);
  });

  describe.skip('getSignUrl', () => {
    it('should return a sign URL', async () => {
      const redirectUrl = await trelloStrategy.getSignUrl();
      expect(redirectUrl).toBeDefined();
      expect(typeof redirectUrl).toBe('string');
    });
  });

  describe('getUserTokens', () => {
    it('should return an access token and access token secret', async () => {
      const mockUrl =
        'https://trello.com/1/OAuthAuthorizeToken?oauth_token=mockToken&oauth_verifier=mockVerifier';
      const mockRequestTokenSecret = 'mockSecret';

      trelloStrategy.secret = mockRequestTokenSecret;

      // Set up mock getAccessToken method
      trelloStrategy.getAccessToken = jest.fn().mockReturnValue({
        accessToken: 'mockAccessToken',
        accessTokenSecret: 'mockAccessTokenSecret',
      });

      const userTokens = await trelloStrategy.getUserTokens(mockUrl);

      expect(trelloStrategy.getAccessToken).toBeCalledWith(
        'mockToken',
        mockRequestTokenSecret,
        'mockVerifier',
      );
      expect(userTokens).toEqual({
        accessToken: 'mockAccessToken',
        accessTokenSecret: 'mockAccessTokenSecret',
      });
    });
  });

  describe('getRequestToken', () => {
    it('should return a request token and secret', async () => {
      // Set up mock getOAuthRequestToken method
      trelloStrategy.oauthClient.getOAuthRequestToken = jest
        .fn()
        .mockImplementation((cb: any) => cb(null, 'mockToken', 'mockSecret'));

      const requestToken = await trelloStrategy.getRequestToken();

      expect(trelloStrategy.oauthClient.getOAuthRequestToken).toBeCalled();
      expect(requestToken).toEqual({
        token: 'mockToken',
        secret: 'mockSecret',
      });
    });
  });

  describe.skip('getAccessToken', () => {
    it('should return an access token and access token secret', async () => {
      // Set up mock getOAuthAccessToken method
      trelloStrategy.oauthClient.getOAuthAccessToken = jest
        .fn()
        .mockImplementation(
          (
            requestToken: string,
            requestTokenSecret: string,
            verifier: string,
            cb: any,
          ) => {
            if (
              requestToken === 'mockToken' &&
              requestTokenSecret === 'mockSecret' &&
              verifier === 'mockVerifier'
            ) {
              cb(null, 'mockAccessToken', 'mockAccessTokenSecret');
            } else {
              cb(new Error('Invalid input'));
            }
          },
        );

      const userTokens = await trelloStrategy.getAccessToken(
        'mockToken',
        'mockSecret',
        'mockVerifier',
      );

      expect(trelloStrategy.oauthClient.getOAuthAccessToken).toBeCalledWith(
        'mockToken',
        'mockSecret',
        'mockVerifier',
      );
      expect(userTokens).toEqual({
        accessToken: 'mockAccessToken',
        accessTokenSecret: 'mockAccessTokenSecret',
      });
    });
  });
});
