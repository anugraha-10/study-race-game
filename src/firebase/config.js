import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtAY1pH_FdjANc-MUp3x0NwxpUPV_ZG0E",
  authDomain: "study-race-game.firebaseapp.com",
  projectId: "study-race-game",
  storageBucket: "study-race-game.firebasestorage.app",
  messagingSenderId: "4748629713",
  appId: "1:4748629713:web:c686c61c4985560578d7f0",
  measurementId: "G-9895KX2YLK"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
