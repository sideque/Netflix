import { initializeApp } from "firebase/app";
import { 
    createUserWithEmailAndPassword,
    getAuth, 
    signInWithEmailAndPassword, 
    signOut} from "firebase/auth"

import { addDoc, 
    arrayRemove, 
    arrayUnion, 
    collection, 
    doc, 
    getDocs, 
    getFirestore, 
    query,
    updateDoc,
    where} from "firebase/firestore";
import Wishlist from "./pages/Wishlist/Wishlist";
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
        Wishlist:[],
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

// WhishList

const AddToWishlist = async (userId, item) => {
    if (!userId) return toast.error("You must be logged in to add items to Wishlist");
    try {
        const q = query(collection(db, "user"), where('uid', '==', userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (docSnap) => {
            const userRef = doc(db, "user", docSnap.id);
            await updateDoc(userRef, {
                Wishlist: arrayUnion(item)
            });
            toast.success("Added to Wishlist")
        });
    } catch (error) {
        console.error("Remove from wishlist error: ", error);
        toast.error("Could not remove from wishlist.")
    }
}

const removeFromWishlist = async (userId, movie) => {
    try {
        const q = query(collection(db, "user"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast.error("User not found");
            return;
        }

        querySnapshot.forEach(async (docSnap) => {
            const userRef = doc(db, "user", docSnap.id);
            await updateDoc(userRef, {
                Wishlist: arrayRemove(movie)
            });
            toast.success("Removed from Wishlist");
        });
    } catch (error) {
        console.error("Error removing from wishlist: ", error);
        toast.error("Could not remove from Wishlist")
    }
};

const getWishlist = async (userId) => {
    try {
        const q = query(collection(db, "user"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();
            return data.Wishlist || [];
        }
        return [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

export {
    auth,
    db,
    login,
    signup,
    logout,
    AddToWishlist,
    removeFromWishlist,
    getWishlist,
}