// React imports
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Third-party imports
import * as SplashScreen from "expo-splash-screen";
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
SplashScreen.preventAutoHideAsync();

export default function App() {
    /* Car Context States */
    const [cars, setCars] = useState([]);
    const [garageCars, setGarageCars] = useState([]);
    const [currentCar, setCurrentCar] = useState(null);
    const [carInGarage, setCarInGarage] = useState(false);
    const [inCarAddMode, setInCarAddMode] = useState(true);
    const [inGarageMode, setInGarageMode] = useState(false);

    /* Auth States */
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authId, setAuthId] = useState(null);

    /* Splash Screen */
    useEffect(() => {
        const timer = setTimeout(() => {
            SplashScreen.hideAsync();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    /* Effect to set data from the db to local state */
    useEffect(() => {
        if (authId) {
            async function loadAllCars() {
                try {
                    const result = await database.getAllCarsFromDB();
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

                    // Getting users garage cars from the db
                    const userId = await database.getUserIdFromAuth(authId);
                    const initialGarageCars =
                        await database.getGarageCarsFromDB(userId);
                    setGarageCars(initialGarageCars);
                } catch (error) {
                    console.log(
                        "Error when trying to read from the db:",
                        error
                    );
                }
            }
            loadAllCars();
        }
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
                        inGarageMode,
                        setInGarageMode,
                        carInGarage,
                        setCarInGarage,
                    }}
                >
                    <NavigationContainer>
                        {isAuthenticated ? (
                            <Tab.Navigator initialRouteName="Garage">
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
