// React imports
import React from "react";
import { useContext, useEffect } from "react";
import { Image, View, Text, Pressable } from "react-native";

// Third-party imports
import { DataTable } from "react-native-paper";
import Toast from "react-native-toast-message";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import { AuthContext } from "../../context/AuthContext";
import * as database from "../../database";

export default function CarDetailScreen() {
    /* State */
    const {
        currentCar,
        garageCars,
        setGarageCars,
        carInGarage,
        setCarInGarage,
    } = useContext(CarContext);
    const { authId } = useContext(AuthContext);

    /* Side Effects */
    useEffect(() => {
        setCarInGarage(searchGarage(currentCar));
    }, [garageCars, currentCar]);

    const searchGarage = (carToFind) => {
        return garageCars.some((currCar) => currCar.id === carToFind.id);
    };

    const handleAddCarToGarage = async () => {
        try {
            const userId = await database.getUserIdFromAuth(authId);
            const success = await database.addCarToGarage(
                userId,
                currentCar.id
            );

            if (success) {
                const updatedGarageCars = [...garageCars, currentCar];
                setGarageCars(updatedGarageCars);
                setCarInGarage(true);
                showSuccessToast("Car added to garage.");
            } else {
                showErrorToast(
                    "Failed to add car to garage. Please try again."
                );
            }
        } catch (error) {
            showErrorToast("Failed to add car to garage. Please try again.");
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
        <View style={styles.container}>
            <View
                style={[
                    styles.imageContainer,
                    {
                        backgroundColor: currentCar.isLimitedStock
                            ? "red"
                            : "black",
                    },
                ]}
            >
                <Image
                    source={{ uri: currentCar.image }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.creditContainer}>
                <Text style={styles.creditText}>Cr.{currentCar.credit}</Text>
                <Text
                    style={[
                        styles.creditText,
                        {
                            color: currentCar.isLimitedStock
                                ? "red"
                                : "#007038",
                        },
                    ]}
                >
                    {currentCar.isLimitedStock ? "Limited Stock" : "In Stock"}
                </Text>
            </View>

            <DataTable>
                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={styles.leftText}>Manufacturer:</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={styles.rightText}>{currentCar.brand}</Text>
                    </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={styles.leftText}>Model:</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={styles.rightText}>{currentCar.model}</Text>
                    </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={styles.leftText}>Year:</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={styles.rightText}>{currentCar.year}</Text>
                    </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={styles.leftText}>PP:</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={styles.rightText}>{currentCar.pp}</Text>
                    </DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                    <DataTable.Cell>
                        <Text style={styles.leftText}>Drivetrain:</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                        <Text style={styles.rightText}>
                            {currentCar.drivetrain}
                        </Text>
                    </DataTable.Cell>
                </DataTable.Row>
            </DataTable>

            <Pressable
                style={[styles.addButton, carInGarage && styles.disabledButton]}
                onPress={!carInGarage ? handleAddCarToGarage : null}
                disabled={carInGarage}
            >
                <Text
                    style={[
                        styles.addButtonText,
                        carInGarage && styles.disabledButtonText,
                    ]}
                >
                    {carInGarage ? "ALREADY IN GARAGE" : "ADD TO GARAGE"}
                </Text>
            </Pressable>
        </View>
    );
}
