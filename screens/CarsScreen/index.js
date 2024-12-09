// React imports
import React, { useContext } from "react";
import { FlatList, View, Text } from "react-native";

// In-project imports
import { CarContext } from "../../context/CarContext";
import Car from "../../components/Car";
import styles from "./styles";

export default function CarsScreen({ filters }) {
  const { cars } = useContext(CarContext);

  const filterCars = (cars, filters) => {
    const { limitedStock, minPp, maxPp, minCredit, maxCredit } = filters;

    return cars.filter((car) => {
      const withinPpRange = car.pp >= minPp && car.pp <= maxPp;
      const matchesLimitedStock = limitedStock ? car.isLimitedStock : true;
      const withinCreditRange = car.credit >= minCredit && car.credit <= maxCredit;
      return withinPpRange && matchesLimitedStock && withinCreditRange;
    });
  };

  console.log("Cars:", cars);
  console.log("Filters:", filters);

  const filteredCars = filterCars(cars, filters);

  console.log("Filtered Cars:", filteredCars);

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

  if (filteredCars.length === 0) {
    return (
      <View style={styles.noCarsContainer}>
        <Text style={styles.noCarsText}>No cars available</Text>
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