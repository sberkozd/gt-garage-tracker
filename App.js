import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import CarsStackNavigator from "./screens/CarsStackNavigator";
import GarageScreen from "./screens/GarageScreen";
import { CarContext } from "./context/CarContext";
import { useEffect, useState } from "react";
import * as database from "./database";

const Tab = createBottomTabNavigator();

export default function App() {
    /* Car Context States */
    const [cars, setCars] = useState([]);
    const [garageCars, setGarageCars] = useState([]);
    const [currentCar, setCurrentCar] = useState(null);

    /* Effect to set data from the db to local state */
    useEffect(() => {
        async function loadAllCars() {
            try {
                await database
                    .getCarsFromDB()
                    .then((result) => {
                        const dbCars = result.map((car) => ({
                            id: car.id,
                            brand: car.brand,
                            model: car.model,
                            year: car.year,
                            pp: car.pp,
                            drivetrain: car.drivetrain,
                            image: car.image,
                            credit: car.credit,
                            isLimitedStock: car.isLimitedStock,
                        }));
                        setCars(dbCars);
                    })
                    .catch((error) => {
                        console.log(
                            "Error loading the Cars from the db:",
                            error
                        );
                    });
            } catch (error) {
                console.log("Error when trying to read from the db:", error);
            }
        }
        loadAllCars();
    }, []);

    return (
        <CarContext.Provider
            value={{
                cars,
                setCars,
                garageCars,
                setGarageCars,
                currentCar,
                setCurrentCar,
            }}
        >
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Cars"
                        children={() => <CarsStackNavigator />}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="car"
                                    color={color}
                                    size={size}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Garage"
                        children={() => <GarageScreen />}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons
                                    name="home"
                                    color={color}
                                    size={size}
                                />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </CarContext.Provider>
    );
}
