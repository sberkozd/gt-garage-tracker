/*
The Firebase write functions
*/

import {
    addDoc,
    collection,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "./config";

/* User related functions */

export async function addUserToDB(nickname, email, authId) {
    try {
        const collectionRef = collection(db, "users");

        const docRef = await addDoc(collectionRef, {
            nickname: nickname,
            authId: authId,
            email: email,
        });

        console.log("New User successfully added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.log("Error adding new User to DB:", error.message);
        return null;
    }
}

/* Garage management functions */

export async function addCarToGarage(userId, carId) {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            carsInGarage: arrayUnion(carId),
        });

        console.log(`Car ${carId} added to user ${userId}'s garage.`);
        return true;
    } catch (error) {
        console.log("Error adding car to garage:", error.message);
        return false;
    }
}

export async function removeCarFromGarage(userId, carId) {
    try {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            carsInGarage: arrayRemove(carId),
        });

        console.log(`Car ${carId} removed from user ${userId}'s garage.`);
        return true;
    } catch (error) {
        console.log("Error removing car from garage:", error.message);
        return false;
    }
}
