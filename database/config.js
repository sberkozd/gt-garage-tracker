import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDbSYohr6vBoo6-PFvtMZV0xkrS3e5OXA8",
    authDomain: "my2kguide-80970.firebaseapp.com",
    projectId: "my2kguide-80970",
    storageBucket: "my2kguide-80970.firebasestorage.app",
    messagingSenderId: "305390721441",
    appId: "1:305390721441:web:1dee8f39e94d83bd4393e0",
    measurementId: "G-MQ1PKMS6WZ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth, app, storage };