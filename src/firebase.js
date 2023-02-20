import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBHvxSH9rzK-Jk8lW-lrCMh7Buf_k8Wpbc",
  authDomain: "chess-online-e20f5.firebaseapp.com",
  projectId: "chess-online-e20f5",
  storageBucket: "chess-online-e20f5.appspot.com",
  messagingSenderId: "522135333758",
  appId: "1:522135333758:web:973b918c2e63c097b3612f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;