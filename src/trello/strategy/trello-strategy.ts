import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oauth from 'oauth';

@Injectable()
export class TrelloStrategy {
  // private readonly oauthClient: oauth.OAuth;
  public readonly oauthClient: oauth.OAuth;
  public secret: string;

  constructor(public configService: ConfigService) {
    const apiKey = this.configService.get<string>('TRELLO_CLIENT_ID');
    const apiSecret = this.configService.get<string>('TRELLO_CLIENT_SECRET');
    const callbackUrl = this.configService.get<string>(
      'TRELLO_CLIENT_CALLBACK',
    );

    this.oauthClient = new oauth.OAuth(
      'https://trello.com/1/OAuthGetRequestToken',
      'https://trello.com/1/OAuthGetAccessToken',
      apiKey,
      apiSecret,
      '1.0A',
      callbackUrl,
      'HMAC-SHA1',
    );
  }

  async getSignUrl(): Promise<string> {
    const { token, secret } = await this.getRequestToken();

    this.secret = secret;

    const redirectUrl = this.oauthClient.signUrl(
      'https://trello.com/1/OAuthAuthorizeToken',
      token,
      secret,
    );

    return redirectUrl;
  }

  async getUserTokens(url: string) {
    const [, data] = url.split('?');

    const splittedData = data.split('&');

    const requestToken = splittedData[0].replace('oauth_token=', '');
    const verifier = splittedData[1].replace('oauth_verifier=', '');

    const requestTokenSecret = this.secret;

    return await this.getAccessToken(
      requestToken,
      requestTokenSecret,
      verifier,
    );
  }

  async getRequestToken(): Promise<{ token: string; secret: string }> {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthRequestToken((err, token, secret) => {
        if (err) {
          reject(err);
        } else {
          resolve({ token, secret });
        }
      });
    });
  }

  async getAccessToken(
    requestToken: string,
    requestTokenSecret: string,
    verifier: string,
  ): Promise<{ accessToken: string; accessTokenSecret: string }> {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthAccessToken(
        requestToken,
        requestTokenSecret,
        verifier,
        (err, accessToken, accessTokenSecret) => {
          if (err) {
            reject(err);
          } else {
            resolve({ accessToken, accessTokenSecret });
          }
        },
      );
    });
  }
}
