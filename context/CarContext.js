import { createContext } from "react";

/*
Creating the CarsContext
*/

export const CarContext = createContext({
    cars: [],
    setCars: () => {},
    currentCar: {},
    setCurrentCar: () => {},
    garageCars: false,
    setGarageCars: () => {},
    inCarAddMode: false,
    setInCarAddMode: () => {},
    inGarageMode: false,
    setInGarageMode: () => {},
    carInGarage: false,
    setCarInGarage: () => {},
});
