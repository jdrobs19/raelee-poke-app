import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

export const firebaseConfig = {
  apiKey: "AIzaSyA5crY9aqZ4hpjC9yO4OIgcUvaZ4IZNPYk",
  authDomain: "raelee-poke-app.firebaseapp.com",
  projectId: "raelee-poke-app",
  storageBucket: "raelee-poke-app.firebasestorage.app",
  messagingSenderId: "813356799047",
  appId: "1:813356799047:web:86458b6a12011531e50d62"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);