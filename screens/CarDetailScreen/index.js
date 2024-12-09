// React imports
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
    Modal,
    Image,
    View,
    Text,
    TouchableWithoutFeedback,
    Pressable,
    TouchableOpacity,
} from "react-native";


// Third-party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DataTable } from "react-native-paper";
import Toast from "react-native-toast-message";
import FlipCard from "react-native-flip-card";

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
        inCarAddMode,
        setInCarAddMode,
        setInGarageMode,
    } = useContext(CarContext);
    const { authId } = useContext(AuthContext);
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);

    /* Side effects */
    useFocusEffect(
        useCallback(() => {
            setInCarAddMode(true);
            setInGarageMode(false);
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleShowModal}
                    style={{ marginLeft: 15 }}
                >
                    <MaterialCommunityIcons
                        name="information-outline"
                        size={30}
                        color="#000000"
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        setCarInGarage(searchGarage(currentCar));
    }, [garageCars, currentCar]);

    const searchGarage = (carToFind) => {
        return garageCars.some((currCar) => currCar.id === carToFind.id);
    };

    /* Handlers */
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
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
            <View style={styles.cardContainerz}>
                <FlipCard
                    style={styles.card}
                    friction={1000}
                    perspective={1000}
                    clickable={true}
                >
                    <View
                        style={[
                            styles.face,
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
                    <View style={styles.back}>
                        <Text>Placeholder Text</Text>
                    </View>
                </FlipCard>
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

            <Modal visible={showModal} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={handleHideModal}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dialog}>
                                <Text style={styles.heading}>Car Details</Text>
                                <Text style={styles.dialogText}>
                                    On this screen, you can tap the car image in
                                    order to view more details about it.
                                </Text>
                                <Text style={styles.dialogText}>
                                    If the car is not already in your garage,
                                    you can also remove it from this screen.
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
