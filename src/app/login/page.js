"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider, githubProvider } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import logo from '@/assets/images/logo.webp'; 
import githubLogo from '@/assets/images/logo-github.png';
import googleLogo from '@/assets/images/logo-google.svg';


export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/nba/teams');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignInGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(`Erreur lors de la connexion avec Google: ${err.message}`);
    }
  };

  const handleSignInGitHub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      setError(`Erreur lors de la connexion avec GitHub: ${err.message}`);
    }
  };

  return (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="flex flex-col items-center mb-8">
      <div className="w-64 h-64 relative mb-4">
        <Image 
          src={logo} 
          alt="NBA API Logo" 
          layout="fill"
          objectFit="contain" 
        />
      </div>
      <h1 className="text-2xl font-bold">Connexion</h1>
    </div>
    <div className="flex flex-col items-center">
      <Button
        className="mb-2"
        logo={googleLogo}
        size="lg"
        onClick={handleSignInGoogle}>
        Se connecter avec Google
      </Button>
      <Button
        logo={githubLogo}
        size="lg"
        variant="secondary"
        onClick={handleSignInGitHub}>
        Se connecter avec GitHub
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  </div>

  );
}
