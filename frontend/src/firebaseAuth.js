// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmLobk_-Ff0D3ZY6U_iRPgJNSMSnUnksY",
  authDomain: "health-claim-risk-prediction.firebaseapp.com",
  projectId: "health-claim-risk-prediction",
  storageBucket: "health-claim-risk-prediction.firebasestorage.app",
  messagingSenderId: "962857887033",
  appId: "1:962857887033:web:def6deaf7956f50b5134e8",
  measurementId: "G-GJ6VQ39HMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export async function signupForm(email, password) {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created:", cred.user)
        return cred.user;
    }
    catch (error) {
        console.log(error.message)
    }
}

export async function signinForm(email, password) {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", cred.user)
        return cred.user;
    } catch (error) {
        console.log(error.message)
    }       
}