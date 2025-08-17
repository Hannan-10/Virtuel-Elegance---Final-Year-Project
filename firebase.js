// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_sHvsE5N2fwqXCgBdo7WGpfr95huGW_k",
  authDomain: "virtuelelegance.firebaseapp.com",
  projectId: "virtuelelegance",
  storageBucket: "virtuelelegance.firebasestorage.app",
  messagingSenderId: "1043668191393",
  appId: "1:1043668191393:web:7e57dfad5bf9611a1d88e0",
  measurementId: "G-SDLZ6ELG2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);