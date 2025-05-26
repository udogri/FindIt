// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
 apiKey: "AIzaSyC0u7Ik4KV3mcHeylwyhCBg90fFVr_iSZI",
  authDomain: "findit-f0c29.firebaseapp.com",
  projectId: "findit-f0c29",
storageBucket: "findit-f0c29.appspot.com",
  messagingSenderId: "4075920337",
  appId: "1:4075920337:web:e66b843dfda60829601ef0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
