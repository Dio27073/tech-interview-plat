'use client';

import React from 'react';
import { PyodideProvider } from './providers/PyodideProvider';
// Import any other providers you have

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Explicitly set preload to true for PyodideProvider */}
      <PyodideProvider preload={true}>
        {/* Your other providers go here */}
        {children}
      </PyodideProvider>
    </>
  );
}