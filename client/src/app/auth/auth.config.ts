import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
              authority: environment.authorityUrl,
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: environment.clientId,
              scope: 'email openid profile', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
}
// auth/auth.config.ts was generated after using 
// `ng add angular-auth-oidc-client`, and select 
// `Code Flow with PKCE using refresh tokens`