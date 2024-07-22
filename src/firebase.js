import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCauJZzSd4wlZFpwep7HYuEcJkpGtU_Oho",
  authDomain: "fulbito-lunes-app.firebaseapp.com",
  projectId: "fulbito-lunes-app",
  storageBucket: "fulbito-lunes-app.appspot.com",
  messagingSenderId: "439925772190",
  appId: "1:439925772190:web:2394a6012907247d54908f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebase = getFirestore(app);