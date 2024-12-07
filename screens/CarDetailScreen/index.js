// React imports
import React from "react";
import { useContext } from "react";
import { Image, View, Text } from "react-native";

// Third-party imports
import { DataTable } from "react-native-paper";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";

export default function CarDetailScreen() {
    const { currentCar } = useContext(CarContext);

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
        </View>
    );
}
