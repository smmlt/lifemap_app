import { initializeApp, getApps, getApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyASHPauS8H8u5fM8lXndr2V0GeNtpwD_ss",
  authDomain: "lifemap-app-dc946.firebaseapp.com",
  projectId: "lifemap-app-dc946",
  storageBucket: "lifemap-app-dc946.firebasestorage.app",
  messagingSenderId: "848136974000",
  appId: "1:848136974000:web:c74b3e412a19624e3a1575"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app);

export const db = getFirestore(app);