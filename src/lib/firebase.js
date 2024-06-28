import { initializeApp } from 'firebase/app';
import { GithubAuthProvider } from 'firebase/auth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "nba-front.firebaseapp.com",
    projectId: "nba-front",
    storageBucket: "nba-front.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };
  

const app = initializeApp(firebaseConfig);

const githubProvider = new GithubAuthProvider();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, githubProvider };

