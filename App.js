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
import SettingsScreen from "./screens/SettingsScreen";
import SplashScreen from "./components/SplashScreen";
import * as Font from "expo-font";

// Localisation
import i18next from "i18next";
import { initI18next } from "./i18n/i18n";

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
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const [loadingFonts, setLoadingFonts] = useState(true);

    /* Side effects */

    // Loading fonts
    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    ...MaterialCommunityIcons.font,
                });
                setLoadingFonts(false);
            } catch (error) {
                console.log("Error loading fonts:", error);
            }
        };
        loadFonts();
    }, []);

    //Loading translation
    useEffect(() => {
        async function initTranslation() {
            try {
                await initI18next();
                setLoadingTranslations(false);
            } catch (error) {
                console.error("Error initialising i18n:", error);
            }
        }
        initTranslation();
    }, []);

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
                setCurrentUser(null);
                auth.signOut();
            }
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

                    const userId = await database.getUserIdFromAuth(authId);

                    // Getting user object from db
                    const userObject = await database.getUserFromUserId(userId);
                    setCurrentUser(userObject);

                    // Getting users garage cars from the db
                    const initialGarageCars =
                        await database.getGarageCarsFromDB(userId);
                    setGarageCars(initialGarageCars);
                    setLoading(false);
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

    if (loading || loadingTranslations) {
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
                    currentUser,
                    setCurrentUser,
                    loading,
                    setLoading,
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
                                        tabBarLabel:
                                            i18next.t("common.nav.cars"),
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
                                        tabBarLabel:
                                            i18next.t("common.nav.garage"),
                                    }}
                                />
                                <Tab.Screen
                                    name="Garage Summary"
                                    component={GarageSummaryScreen}
                                    options={{
                                        tabBarIcon: ({ color }) => (
                                            <MaterialCommunityIcons
                                                name="chart-bar-stacked"
                                                color={color}
                                                size={30}
                                            />
                                        ),
                                        tabBarLabel: i18next.t(
                                            "common.nav.GarageSummary"
                                        ),
                                    }}
                                />
                                <Tab.Screen
                                    name="Settings"
                                    component={SettingsScreen}
                                    options={{
                                        tabBarIcon: ({ color }) => (
                                            <MaterialCommunityIcons
                                                name="cog"
                                                color={color}
                                                size={30}
                                            />
                                        ),
                                        tabBarLabel: i18next.t(
                                            "common.nav.settings"
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
