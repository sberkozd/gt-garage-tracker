// React imports
import { View, Text, Image, Pressable } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Third-party imports
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";

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
    } = useContext(CarContext);
    const navigation = useNavigation();

    const [localCarInGarage, setLocalCarInGarage] = useState(null);

    /* Side Effects */
    useFocusEffect(
        useCallback(() => {
            setLocalCarInGarage(searchGarage(id));
        }, [])
    );

    const searchGarage = (carToFindId) => {
        return garageCars.some((currCar) => currCar.id === carToFindId);
    };

    /* Handlers */
    const handleCarPress = () => {
        const pressedCar = cars.find((car) => car.id === id);
        setCurrentCar(pressedCar);
        navigation.navigate("CarDetail");
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
