/* Centralised location for exporting database functions */
export { getAllCarsFromDB, getGarageCarsFromDB, getUserIdFromAuth } from "./read";
export { addUserToDB, addCarToGarage, removeCarFromGarage } from "./write";
