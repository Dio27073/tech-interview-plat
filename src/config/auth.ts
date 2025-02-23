// src/config/auth.ts
import { Amplify } from 'aws-amplify';

if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
  throw new Error('NEXT_PUBLIC_COGNITO_USER_POOL_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_COGNITO_CLIENT_ID is not defined');
}

export const cognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
};

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: cognitoConfig.userPoolId,
      userPoolClientId: cognitoConfig.userPoolClientId
    }
  }
}, {
  ssr: true
});