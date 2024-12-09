// React imports
import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    FlatList,
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

// Third party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";

export default function GarageScreen() {
    /* State */
    const { garageCars } = useContext(CarContext);
    const navigation = useNavigation();

    const [showModal, setShowModal] = useState(false);

    /* Side effects */
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
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

    /* Handlers */
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const renderItem = ({ item }) => (
        <Car
            id={item.id}
            brand={item.brand}
            model={item.model}
            year={item.year}
            pp={item.pp}
            drivetrain={item.drivetrain}
            image={item.image}
            credit={item.credit}
            isLimitedStock={item.isLimitedStock}
        />
    );

    return (
        <>
            <FlatList
                data={garageCars}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <Modal visible={showModal} transparent={true} animationType="fade"> 
                <TouchableWithoutFeedback onPress={handleHideModal}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dialog}>
                                <Text style={styles.heading}>
                                    Managing your Garage
                                </Text>
                                <Text style={styles.dialogText}>
                                    To remove a car from your garage, simply
                                    tap the car you want to remove.
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}
