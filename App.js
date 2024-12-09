// React imports
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Third-party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// In-project imports
import { AuthContext } from "./context/AuthContext";
import { CarContext } from "./context/CarContext";
import * as database from "./database";
import CarsStackNavigator from "./components/CarsStackNavigator";
import GarageScreen from "./screens/GarageScreen";
import GarageSummaryScreen from "./screens/GarageSummaryScreen";
import LoginScreen from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();

export default function App() {
    /* Car Context States */
    const [cars, setCars] = useState([]);
    const [garageCars, setGarageCars] = useState([]);
    const [currentCar, setCurrentCar] = useState(null);
    const [carInGarage, setCarInGarage] = useState(false);
    const [inCarAddMode, setInCarAddMode] = useState(false);

    /* Auth States */
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authId, setAuthId] = useState(null);

    /* Effect to set data from the db to local state */
    useEffect(() => {
        async function loadAllCars() {
            try {
                await database
                    .getAllCarsFromDB()
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

                        //TODO: Set garage cars for curr user
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
    }, [authId]);

    return (
        <>
            <AuthContext.Provider
                value={{
                    isAuthenticated,
                    setIsAuthenticated,
                    authId,
                    setAuthId,
                }}
            >
                <CarContext.Provider
                    value={{
                        cars,
                        setCars,
                        garageCars,
                        setGarageCars,
                        currentCar,
                        setCurrentCar,
                        inCarAddMode,
                        setInCarAddMode,
                        carInGarage,
                        setCarInGarage,
                    }}
                >
                    <NavigationContainer>
                        {isAuthenticated ? (
                            <Tab.Navigator>
                                <Tab.Screen
                                    name="Cars"
                                    component={CarsStackNavigator}
                                    options={{
                                        headerShown: false,
                                        tabBarIcon: ({ color }) => (
                                            <MaterialCommunityIcons
                                                name="car"
                                                color={color}
                                                size={30}
                                            />
                                        ),
                                    }}
                                />
                                <Tab.Screen
                                    name="Garage Summary"
                                    component={GarageSummaryScreen}
                                    options={{
                                        tabBarIcon: ({ color }) => (
                                            <MaterialCommunityIcons
                                                name="chart-pie"
                                                color={color}
                                                size={30}
                                            />
                                        ),
                                    }}
                                />
                                <Tab.Screen
                                    name="Garage"
                                    component={GarageScreen}
                                    options={{
                                        tabBarIcon: ({ color }) => (
                                            <MaterialCommunityIcons
                                                name="garage"
                                                color={color}
                                                size={30}
                                            />
                                        ),
                                    }}
                                />
                            </Tab.Navigator>
                        ) : (
                            <LoginScreen />
                        )}
                    </NavigationContainer>
                </CarContext.Provider>
            </AuthContext.Provider>
        </>
    );
}
