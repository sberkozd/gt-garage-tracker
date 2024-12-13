// React imports
import React, { useState, useContext } from "react";

// Third-party imports
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

// In-project imports
import { CarContext } from "../../context/CarContext";
import CarsScreen from "../../screens/CarsScreen";
import CarDetailScreen from "../../screens/CarDetailScreen";
import CarFilterDialog from "../dialog/CarFilterDialog";

// Language
import i18next from "i18next";

const CarsStack = createStackNavigator();

export default function CarsStackNavigator() {
  const { currentCar } = useContext(CarContext);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [filters, setFilters] = useState({
    limitedStock: false,
    minPp: 0,
    maxPp: 1500,
    minCredit: 0,
    maxCredit: 500000,
  });

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <CarsStack.Navigator>
        <CarsStack.Screen
          name="CarsList"
          options={{
            headerTitle: i18next.t("screens.cars.title"),
            headerRight: () => (
              <Icon
                name="filter"
                size={25}
                style={{ marginRight: 15 }}
                onPress={() => setIsDialogVisible(true)}
              />
            ),
          }}
        >
          {(props) => <CarsScreen {...props} filters={filters} />}
        </CarsStack.Screen>
        <CarsStack.Screen
          name="CarDetail"
          component={CarDetailScreen}
          options={{
            headerTitle: currentCar
              ? `${currentCar.brand} ${currentCar.model} '${currentCar.year}`
              : "Car Details",
          }}
        />
      </CarsStack.Navigator>
      {isDialogVisible && (
        <CarFilterDialog
          visible={isDialogVisible}
          onClose={() => setIsDialogVisible(false)}
          onApply={applyFilters}
          limitedStock={filters.limitedStock}
        />
      )}
    </>
  );
}
