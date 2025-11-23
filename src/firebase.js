import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword,
    getAuth, 
    signInWithEmailAndPassword, 
    signOut} from "firebase/auth"

import { addDoc, 
    collection, 
    getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAhqRTj8ryEjycN8DiCnFNnX2SLucgwO60",
  authDomain: "netflix-clone-3a81a.firebaseapp.com",
  projectId: "netflix-clone-3a81a",
  storageBucket: "netflix-clone-3a81a.firebasestorage.app",
  messagingSenderId: "859254605624",
  appId: "1:859254605624:web:9f0f4adb66c570897de3cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
    try {
       const res = await createUserWithEmailAndPassword(auth, email, password);
       const user = res.user;
       await addDoc(collection(db, "user"), {
        uid: user.uid, 
        name, 
        authProvider: "local", 
        email,
       })
    } catch (error) {
        console.log(error);
        const msg = error?.code
          ? (error.code.split('/')[1] || error.code).replace(/-/g, ' ')
          : (error?.message || 'An error occurred');
        toast.error(msg);
    }
}

const login = async (email, password) => {
    try {
        // await so rejection is caught by try/catch
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        const msg = error?.code
          ? (error.code.split('/')[1] || error.code).replace(/-/g, ' ')
          : (error?.message || 'An error occurred');
        toast.error(msg);
    }
}

const logout = () => {
    signOut(auth);
}

export {
    auth,
    db,
    login,
    signup,
    logout,
}