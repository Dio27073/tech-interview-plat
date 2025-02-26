// src/app/providers.tsx
'use client';

import React, { useEffect, ReactNode } from 'react';
import { checkAmplifyConfig, configureAmplifyServices } from '@/lib/aws-config';

// Import auth config (this should initialize Amplify Auth)
import '@/config/auth';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Configure additional Amplify services on component mount - only in browser environment
    if (typeof window !== 'undefined') {
      try {
        configureAmplifyServices();
        
        // Verify configuration
        const isConfigured = checkAmplifyConfig();
        if (!isConfigured) {
          console.warn('Amplify configuration seems incomplete. Please check your environment variables.');
        }
      } catch (error) {
        console.error('Error initializing additional AWS Amplify services:', error);
      }
    }
  }, []);

  return (
    <>
      {/* Add other providers here if needed */}
      {children}
    </>
  );
}