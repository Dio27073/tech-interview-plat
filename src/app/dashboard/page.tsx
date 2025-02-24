// src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import CodeEditor from '@/components/CodeEditor';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Add a short delay to ensure auth state is stable
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Only redirect if definitely not authenticated
      if (isAuthenticated === false) {
        router.push('/auth');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Only show dashboard if definitely authenticated
  if (isAuthenticated === true) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-blue-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">DS&A Study Platform</h1>
            <div>Welcome, {user?.username || 'User'}</div>
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-6">Your Learning Dashboard</h2>
          
          {/* Here you'd render your dashboard components */}
          <CodeEditor />
        </main>
      </div>
    );
  }
  
  // Fallback while waiting for redirect
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}