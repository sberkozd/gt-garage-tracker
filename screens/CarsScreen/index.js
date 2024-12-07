// React imports
import React, { useContext } from "react";
import { FlatList } from "react-native";

// In-project imports
import styles from "./styles";
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";

export default function CarsScreen() {
    const { cars } = useContext(CarContext);

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
        <FlatList
            data={cars}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
    );
}
