import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, Image } from "react-native";

export default function Car({
    brand,
    model,
    year,
    pp,
    drivetrain,
    image,
    credit,
    isLimitedStock,
}) {
    return (
        <View style={styles.card}>
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
        </View>
    );
}
