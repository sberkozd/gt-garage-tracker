// React imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// In-project imports
import styles from "./styles";
import CarsScreen from "../../screens/CarsScreen";
import CarDetailScreen from "../../screens/CarDetailScreen";

const CarsStack = createStackNavigator();

export default function CarsStackNavigator() {
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
                options={{ headerTitle: "Car Detail" }}
            />
        </CarsStack.Navigator>
    );
}
