// React imports
import React, { useCallback, useContext } from "react";
import { FlatList, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// In-project imports
import { AuthContext } from "../../context/AuthContext";
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";
import styles from "./styles";
import SplashScreen from "../../components/SplashScreen";

// Languages
import i18next from "i18next";

/*
The global list of cars from the db are rendered here, along with
the filtering functionality.
*/
export default function CarsScreen({ filters }) {
    const { cars, setInCarAddMode, setInGarageMode } = useContext(CarContext);
    const { loading } = useContext(AuthContext);

    /* Side effects */
    useFocusEffect(
        useCallback(() => {
            setInCarAddMode(true);
            setInGarageMode(false);
        }, [])
    );

    const filterCars = (cars, filters) => {
        const { limitedStock, minPp, maxPp, minCredit, maxCredit } = filters;

        return cars.filter((car) => {
            const withinPpRange = car.pp >= minPp && car.pp <= maxPp;
            const matchesLimitedStock = limitedStock
                ? car.isLimitedStock
                : true;
            const withinCreditRange =
                car.credit >= minCredit && car.credit <= maxCredit;
            return withinPpRange && matchesLimitedStock && withinCreditRange;
        });
    };

    const filteredCars = filterCars(cars, filters);

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

    if (loading) {
        return <SplashScreen />;
    }

    if (filteredCars.length === 0) {
        return (
            <View style={styles.noCarsContainer}>
                <Text style={styles.noCarsText}>
                    {i18next.t("screens.cars.noCars")}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filteredCars}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
}
