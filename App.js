// React imports
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Third-party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { onAuthStateChanged } from "firebase/auth";

// In-project imports
import { auth } from "./database/config";
import { AuthContext } from "./context/AuthContext";
import { CarContext } from "./context/CarContext";
import * as database from "./database";
import CarsStackNavigator from "./components/CarsStackNavigator";
import GarageScreen from "./screens/GarageScreen";
import GarageSummaryScreen from "./screens/GarageSummaryScreen";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./components/SplashScreen";

const Tab = createBottomTabNavigator();

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
    const [loading, setLoading] = useState(true);

    /* Side effects */

    /*
    Use effect for auth persistence.
    Due to the login screen visibility being dependent on
    isAuthenticated, if a users auth is present, they do not 
    need to login again until their session expires or they log out

    The timer is used to add an additional 1 second delay for
    the splash screen to be shown
    */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthId(user.uid);
                setIsAuthenticated(true);
            } else {
                setAuthId(null);
                setIsAuthenticated(false);
            }
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);

            return () => clearTimeout(timer);
        });

        return unsubscribe;
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
                        description: car.description,
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

    if (loading) {
        return <SplashScreen></SplashScreen>;
    }

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
