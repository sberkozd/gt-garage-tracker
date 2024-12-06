/*
The Firebase read functions for the Cars collection
*/

import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

/*
Retrieving all Cars from the db
*/
export async function loadAllCars() {
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
