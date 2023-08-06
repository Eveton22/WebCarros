import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
import { getStorege } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAFtThq3h5cO-K5OUQFyrhJ46SlYczCy1Y",
  authDomain: "webcarros-aa6a6.firebaseapp.com",
  projectId: "webcarros-aa6a6",
  storageBucket: "webcarros-aa6a6.appspot.com",
  messagingSenderId: "783429116574",
  appId: "1:783429116574:web:ee17a6c73162a0c4e2918f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorege(app);

export { db, auth, storage}