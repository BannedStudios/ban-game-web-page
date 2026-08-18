import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);