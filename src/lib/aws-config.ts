// src/lib/aws-config.ts

import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

// Import your existing auth configuration
import '../config/auth';

// Configure additional services
export function configureAmplifyServices() {
  // Only run configuration on client side
  if (typeof window !== 'undefined') {
    try {
      console.log('Amplify additional services configured');
      
      // Note: Auth is already configured in src/config/auth.ts
      // We can add other services here if needed
    } catch (error) {
      console.error('Error configuring additional Amplify services:', error);
    }
  }
}

// Function to check Amplify configuration status
export function checkAmplifyConfig() {
  if (typeof window !== 'undefined') {
    try {
      // Test getting a session to verify configuration
      fetchAuthSession()
        .then(() => console.log('Auth configuration verified'))
        .catch(err => console.warn('Auth not configured properly:', err));
      return true;
    } catch (error) {
      console.error('Amplify not configured properly:', error);
      return false;
    }
  }
  return false;
}