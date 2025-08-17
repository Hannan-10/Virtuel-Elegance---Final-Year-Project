// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
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

// Export Firebase Authentication
export const auth = getAuth(app);




// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyC_sHvsE5N2fwqXCgBdo7WGpfr95huGW_k",
//   authDomain: "virtuelelegance.firebaseapp.com",
//   projectId: "virtuelelegance",
//   storageBucket: "virtuelelegance.appspot.com",
//   messagingSenderId: "1043668191393",
//   appId: "1:1043668191393:web:7e57dfad5bf9611a1d88e0",
//   measurementId: "G-SDLZ6ELG2G"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Auth with persistence
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// export { auth };
