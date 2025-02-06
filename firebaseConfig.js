// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyA1b9h7mtWbonu0gr98MxMCQl5MkwebSUo",
	authDomain: "app-skate-2025.firebaseapp.com",
	projectId: "app-skate-2025",
	storageBucket: "app-skate-2025.firebasestorage.app",
	messagingSenderId: "372147500087",
	appId: "1:372147500087:web:4815f5fe3cdc307c64bbb2",
	measurementId: "G-F5XCPDL719",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
