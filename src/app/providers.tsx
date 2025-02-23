'use client';

import { useEffect } from 'react';
import '@/config/auth';  // Import the Amplify configuration

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Any additional client-side initialization can go here
  }, []);

  return <>{children}</>;
}