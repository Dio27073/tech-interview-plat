'use client';

import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
// import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  // const { isAuthenticated } = useAuth();
  // const router = useRouter();
  
  /* useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm />
    </div>
  );
}