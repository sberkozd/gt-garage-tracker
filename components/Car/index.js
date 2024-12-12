// React imports
import { View, Text, Image, Pressable } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Third-party imports
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import { AuthContext } from "../../context/AuthContext";
import * as database from "../../database";

export default function Car({
    id,
    brand,
    model,
    year,
    pp,
    drivetrain,
    image,
    credit,
    isLimitedStock,
}) {
    const {
        cars,
        currentCar,
        setCurrentCar,
        garageCars,
        setGarageCars,
        inCarAddMode,
        inGarageMode,
    } = useContext(CarContext);
    const { authId } = useContext(AuthContext);
    const navigation = useNavigation();

    const [localCarInGarage, setLocalCarInGarage] = useState(null);

    /* Side Effects */
    useFocusEffect(
        useCallback(() => {
            setLocalCarInGarage(searchGarage(id));
        }, [id, garageCars])
    );
    
    const searchGarage = (carToFindId) => {
        return garageCars.some((currCar) => currCar.id === carToFindId);
    };

    /* Handlers */

    /*
    Dynamic Car onPress functionality
        - If on the Cars screen, pressing a Car will navigate to its details screen.
        - If on the Garage screen, pressing a Car will allow a user to remove it from their garage
    */
    const handleCarPress = () => {
        if (inCarAddMode) {
            const pressedCar = cars.find((car) => car.id === id);
            setCurrentCar(pressedCar);
            navigation.navigate("CarDetail");
        } else if (inGarageMode) {
           handleRemoveCarFromGarage();
        }
    };

    const handleRemoveCarFromGarage = async () => {
        try {
            const userId = await database.getUserIdFromAuth(authId);
            const success = await database.removeCarFromGarage(userId, id);

            if (success) {
                const updatedGarageCars = garageCars.filter(
                    (car) => car.id !== id
                );
                setGarageCars(updatedGarageCars);
                setLocalCarInGarage(false);
                showSuccessToast("Car removed from garage.");
            } else {
                showErrorToast(
                    "Failed to remove car from garage. Please try again."
                );
            }
        } catch (error) {
            showErrorToast(
                "Failed to remove car from garage. Please try again."
            );
        }
    };

    /* Toast logic */
    const showSuccessToast = (msg) => {
        Toast.show({
            type: "success",
            text1: "Success",
            text2: msg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    const showErrorToast = (errMsg) => {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: errMsg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    return (
        <Pressable style={styles.card} onPress={handleCarPress}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.title}>{`${brand} ${model} '${year}`}</Text>
                <View style={styles.chipContainer}>
                    {localCarInGarage && (
                        <MaterialCommunityIcons
                            name="garage"
                            size={24}
                            color="green"
                        />
                    )}
                    <Text style={styles.chip}>{`PP ${pp}`}</Text>
                    <Text style={styles.drivetrain}>{drivetrain}</Text>
                </View>
                {isLimitedStock && (
                    <View style={styles.limitedStockContainer}>
                        <Icon name="warning" size={20} color="red" />
                        <Text style={styles.limitedStockText}>
                            Limited Stock
                        </Text>
                    </View>
                )}
                <View style={styles.creditContainer}>
                    <Text style={styles.creditLabel}>Cr. </Text>
                    <Text style={styles.credit}>{credit}</Text>
                </View>
            </View>
        </Pressable>
    );
}
