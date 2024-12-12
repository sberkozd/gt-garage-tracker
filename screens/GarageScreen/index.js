// React imports
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
    Animated,
    ImageBackground,
    FlatList,
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

// Third party imports
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";

// Project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";
import CarFilterDialog from "../../components/dialog/CarFilterDialog";

export default function GarageScreen() {
    /* State */
    const { garageCars, setInCarAddMode, setInGarageMode } =
        useContext(CarContext);
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const [filters, setFilters] = useState({
        limitedStock: false,
        minPp: 0,
        maxPp: 1500,
        minCredit: 0,
        maxCredit: 500000,
    });

    // Custom slide animation that starts on the centre of the screen (value 0)
    const garageSlideAnimation = useRef(new Animated.Value(0)).current;

    /* Side effects */
    useFocusEffect(
        useCallback(() => {
            setInGarageMode(true);
            setInCarAddMode(false);
        }, [])
    );

    useEffect(() => {
        setShowLoadingModal(true);

        // Starts the animation from the centre of the screen
        Animated.timing(garageSlideAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start();

        // Sets a timer to hide the animation/modal
        // -1000 slides it upwards out of the range of the screen
        const timer = setTimeout(() => {
            Animated.timing(garageSlideAnimation, {
                toValue: -1000,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => setShowLoadingModal(false));
        }, 700);

        // Clearing the timer post-animation
        return () => clearTimeout(timer);
    }, [garageSlideAnimation]);

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
            headerRight: () => (
                <Icon
                    name="filter"
                    size={25}
                    style={{ marginRight: 15 }}
                    onPress={() => setShowFilterDialog(true)}
                />
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

    const handleShowFilterDialog = () => {
        setShowFilterDialog(true);
    };

    const handleHideFilterDialog = () => {
        setShowFilterDialog(false);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const filteredCars = garageCars.filter((car) => {
        return (
            car.pp >= filters.minPp &&
            car.pp <= filters.maxPp &&
            car.credit >= filters.minCredit &&
            car.credit <= filters.maxCredit &&
            (!filters.limitedStock || car.isLimitedStock)
        );
    });

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
            {!showLoadingModal ? (
                <FlatList
                    data={filteredCars}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <View style={{ flex: 1 }}>
                    <Modal
                        visible={showLoadingModal}
                        transparent={true}
                        animationType="none"
                    >
                        <Animated.View
                            style={[
                                styles.animatedContainer,
                                {
                                    transform: [
                                        { translateY: garageSlideAnimation },
                                    ],
                                },
                            ]}
                        >
                            <ImageBackground
                                source={require("../../assets/garageDoor.jpg")}
                                resizeMode="cover"
                                style={styles.image}
                            >
                                <View style={styles.overlay}>
                                    <View style={styles.loadingDialog}>
                                        <Text style={styles.heading}>
                                            Opening Your Garage
                                        </Text>
                                        <Text style={styles.dialogText}></Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </Animated.View>
                    </Modal>

                    <Modal
                        visible={showModal}
                        transparent={true}
                        animationType="fade"
                    >
                        <TouchableWithoutFeedback onPress={handleHideModal}>
                            <View style={styles.overlay}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.dialog}>
                                        <Text style={styles.heading}>
                                            Managing your Garage
                                        </Text>
                                        <Text style={styles.dialogText}>
                                            To remove a car from your garage,
                                            simply tap the car you want to
                                            remove.
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <CarFilterDialog
                        visible={showFilterDialog}
                        onClose={handleHideFilterDialog}
                        onApply={handleApplyFilters}
                        limitedStock={filters.limitedStock}
                    />
                </View>
            )}
        </>
    );
}
