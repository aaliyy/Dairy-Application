// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcJ6M7IRbUGv_Yj7rnhCMysd-zuINPwHA",
  authDomain: "salmandairy-4c0a0.firebaseapp.com",
  projectId: "salmandairy-4c0a0",
  storageBucket: "salmandairy-4c0a0.firebasestorage.app",
  messagingSenderId: "748424833642",
  appId: "1:748424833642:web:b20a4b6048bbb2da807813",
  measurementId: "G-NW5HKB8VKR",
  databaseURL: "https://salmandairy-4c0a0-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export {db};