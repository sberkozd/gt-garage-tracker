// React imports
import { Alert, View, Text, Image, Pressable } from "react-native";
import { useCallback, useContext, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Third-party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import { AuthContext } from "../../context/AuthContext";
import * as database from "../../database";
import i18next from "i18next";

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
        Alert.alert(
            `${i18next.t("screens.cars.remove")}`,
            `${i18next.t("screens.cars.removeMsg", {
                year: year,
                brand: brand,
                model: model,
            })}`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const userId = await database.getUserIdFromAuth(
                                authId
                            );
                            const success = await database.removeCarFromGarage(
                                userId,
                                id
                            );

                            if (success) {
                                const updatedGarageCars = garageCars.filter(
                                    (car) => car.id !== id
                                );
                                setGarageCars(updatedGarageCars);
                                setLocalCarInGarage(false);
                            } else {
                                console.log(
                                    "Failed to remove car from garage. Please try again."
                                );
                            }
                        } catch (error) {
                            console.log(
                                "Failed to remove car from garage. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <Pressable style={styles.card} onPress={handleCarPress}>
            <View>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.iconContainer}>
                    {isLimitedStock && (
                        <View style={styles.limitedStockContainer}>
                            <MaterialCommunityIcons
                                name="alert"
                                size={20}
                                color="red"
                            />
                        </View>
                    )}
                    {localCarInGarage && (
                        <View style={styles.limitedStockContainer}>
                            <MaterialCommunityIcons
                                name="garage"
                                size={24}
                                color="green"
                            />
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.details}>
                <Text style={styles.title}>{`${brand}`}</Text>
                <Text style={styles.title}>{`${model} ${year}`}</Text>
                <View style={styles.chipContainer}>
                    <Text style={styles.chip}>{`PP ${pp}`}</Text>
                    <Text style={styles.drivetrain}>{drivetrain}</Text>
                </View>
                <View style={styles.creditContainer}>
                    <Text style={styles.creditLabel}>Cr. </Text>
                    <Text style={styles.credit}>{credit}</Text>
                </View>
            </View>
        </Pressable>
    );
}
