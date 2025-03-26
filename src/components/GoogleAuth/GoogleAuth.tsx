import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBCxPOexIJUEzpZ63-3MIC2YCRzM33l4RI",
    authDomain: "reach-web-d0efc.firebaseapp.com",
    projectId: "reach-web-d0efc",
    storageBucket: "reach-web-d0efc.appspot.com",
    messagingSenderId: "277153876863",
    appId: "1:277153876863:web:504cce40d5b936308de84a",
    measurementId: "G-BH3JZ94381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };