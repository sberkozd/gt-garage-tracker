// React imports
import { View, Text, Image, Pressable } from "react-native";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

// Third-party imports
import Icon from "react-native-vector-icons/MaterialIcons";

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
    const { cars, setCurrentCar } = useContext(CarContext);
    const navigation = useNavigation();

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
