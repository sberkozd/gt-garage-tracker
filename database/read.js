/*
The Firebase read functions for the Cars collection
*/

import {
    collection,
    doc,
    getDoc,
    getDocs,
    where,
    query,
} from "firebase/firestore";
import { db } from "./config";

/*
Retrieving all Cars from the db
*/
export async function getAllCarsFromDB() {
    const data = [];
    const querySnapshot = await getDocs(collection(db, "cars"));

    querySnapshot.forEach((doc) => {
        const post = {
            ...doc.data(),
            id: doc.id,
        };
        data.push(post);
    });
    return data;
}

/*
Getting all of a specific user's cars in their garage
*/
export async function getGarageCarsFromDB(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.log("User document not found");
            return [];
        }

        const garageCarIds = userDoc.data().carsInGarage || [];

        // Added check here, otherwise the "in" query will fail (as it can't be run on empty array).
        if (garageCarIds.length === 0) {
            console.log("The user has no cars in their garage");
            return [];
        }

        const carsRef = collection(db, "cars");
        const carsQuery = query(carsRef, where("__name__", "in", garageCarIds));
        const querySnapshot = await getDocs(carsQuery);

        const garageCars = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return garageCars;
    } catch (error) {
        console.log("Error fetching garage cars", error.message);
        return [];
    }
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
        console.log("Error fetching user document ID:", error.message);
        return null;
    }
}
