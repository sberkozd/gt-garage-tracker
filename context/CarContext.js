import { createContext } from "react";

/*
Creating the CarsContext and its provider
*/

export const CarContext = createContext({
  cars: [],
  setCars: () => {},
  currentCar: {},
  setCurrentCar: () => {},
  garageCars: false,
  setGarageCars: () => {},
});
