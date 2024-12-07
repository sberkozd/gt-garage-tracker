// React imports
import React from "react";
import { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import CarsScreen from "../../screens/CarsScreen";
import CarDetailScreen from "../../screens/CarDetailScreen";

const CarsStack = createStackNavigator();

export default function CarsStackNavigator() {

    const { currentCar } = useContext(CarContext);

    return (
        <CarsStack.Navigator>
            <CarsStack.Screen
                name="CarsList"
                component={CarsScreen}
                options={{ headerTitle: "Available Cars" }}
            />
            <CarsStack.Screen
                name="CarDetail"
                component={CarDetailScreen}
                options={{ headerTitle: currentCar ? `${currentCar.brand} ${currentCar.model} '${currentCar.year}` : "Car Details"}}
            />
        </CarsStack.Navigator>
    );
}
