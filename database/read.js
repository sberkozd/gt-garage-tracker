/*
The Firebase read functions for the Cars collection
*/

import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "./config";

/*
Retrieving all Cars from the db
*/
export async function getAllCarsFromDB() {
    const data = [];
    const querySnapshot = await getDocs(collection(db, "cars"));

    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);

        const post = {
            ...doc.data(),
            id: doc.id,
        };
        data.push(post);
    });
    return data;
}

/*
Helper function to get the current userId from the authId
Docs itself refereces an array and authId for a given user is 
unique, the first element in the array can be returned.
*/
export async function getUserIdFromAuth(authId) {
    try {
        const usersRef = collection(db, "users");
        const idQuery = query(usersRef, where("authId", "==", authId));
        const querySnapshot = await getDocs(idQuery);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        } else {
            console.log("No user found with the passed authId.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user document ID:", error.message);
        return null;
    }
}
