'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const { signIn, signUp, confirmSignUp, error } = useAuth();
  const searchParams = useSearchParams();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [lastUsername, setLastUsername] = useState('');

  // Set initial mode based on URL parameters
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSigningUp(true);
    } else if (mode === 'signin') {
      setIsSigningUp(false);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(username, password);
    } catch (err) {
      console.error('Authentication failed', err);
      alert(err instanceof Error ? err.message : 'An error occurred during sign in');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(username, password, email);
      setLastUsername(username);
      setNeedsVerification(true);
      console.log('Sign up successful');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred during sign up');
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp(lastUsername, verificationCode);
      alert('Verification successful! You can now sign in.');
      setNeedsVerification(false);
      setIsSigningUp(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred during verification');
    }
  };

  if (needsVerification) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Verify Your Account</h2>
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Verify Account
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl mb-6 text-center">
        {isSigningUp ? 'Create Account' : 'Sign In'}
      </h2>
      
      <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {isSigningUp && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            minLength={8}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isSigningUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSigningUp(!isSigningUp)}
          className="text-blue-500 hover:text-blue-600"
        >
          {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error.message}
        </div>
      )}
    </div>
  );
}