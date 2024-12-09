// React imports
import React from "react";
import { useContext } from "react";
import { FlatList, View, Text } from "react-native";

// Project imports
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";

export default function GarageScreen() {
    const { cars } = useContext(CarContext);//TODO: replace with garage cars

    //TODO: Function to select a garage from the users list of garages

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
