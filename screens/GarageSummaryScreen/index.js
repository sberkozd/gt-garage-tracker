// React imports
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";

// Third party imports
import { signOut } from "firebase/auth";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Progress from 'react-native-progress'; 

// Project imports
import { AuthContext } from "../../context/AuthContext";
import { CarContext } from "../../context/CarContext";
import { getAllCarsFromDB } from "../../database/read";
import { auth } from "../../database/config";
import styles from "./styles";

export default function GarageSummaryScreen() {
    const navigation = useNavigation();
    const { setIsAuthenticated, setAuthId } = useContext(AuthContext);
    const { garageCars } = useContext(CarContext);
    const [totalAvailableCars, setTotalAvailableCars] = useState(0);
    const [mostExpensiveCar, setMostExpensiveCar] = useState(null);
    const [totalGarageValue, setTotalGarageValue] = useState(0);
    const [limitedStockCars, setLimitedStockCars] = useState(0);

    /* Side effects */
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginLeft: 15 }}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        size={30}
                        color="#000000"
                    />
                </TouchableOpacity>
            ),
        });

        const fetchTotalAvailableCars = async () => {
            try {
                const cars = await getAllCarsFromDB();
                setTotalAvailableCars(cars.length);
            } catch (error) {
                console.log("Error fetching total available cars:", error);
            }
        };

        fetchTotalAvailableCars();
    }, [navigation]);
    
    useEffect(() => {
        console.log("Garage Cars:", garageCars);
    
        if (garageCars.length > 0) {
            garageCars.forEach(car => console.log(`Car: ${car.brand} ${car.model}, Credit: ${car.credit}`));
            const expensiveCar = garageCars.reduce((prev, current) => {
                return (parseInt(prev.credit, 10) > parseInt(current.credit, 10)) ? prev : current;
            });
            console.log(`Most Expensive Car: ${expensiveCar.brand} ${expensiveCar.model}, Credit: ${expensiveCar.credit}`);
            setMostExpensiveCar(expensiveCar);
    
            const totalValue = garageCars.reduce((sum, car) => sum + parseInt(car.credit, 10), 0);
            setTotalGarageValue(totalValue.toString());
    
            const limitedStockCount = garageCars.filter(car => car.isLimitedStock).length;
            setLimitedStockCars(limitedStockCount);
        }
    }, [garageCars]);

    /* Handlers */
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                //resetting states
                setIsAuthenticated(false);
                setAuthId(null);
            })
            .catch(() => {
                showErrorToast("Error signing out. Please try again.");
            });
    };

    const progress = totalAvailableCars > 0 ? garageCars.length / totalAvailableCars : 0;

    const getProgressColor = (progress) => {
        if (progress >= 1) return { color: '#E5E4E2', text: 'Platinum' };
        if (progress >= 0.8) return { color: '#800080', text: 'Purple' };
        if (progress >= 0.5) return { color: '#FFD700', text: 'Gold' };
        if (progress >= 0.3) return { color: '#C0C0C0', text: 'Silver' };
        if (progress >= 0.1) return { color: '#CD7F32', text: 'Bronze' }; 
        return { color: 'gray', text: 'Rookie' };
    };

    const { color, text } = getProgressColor(progress);

    return (
        <View style={styles.container}>
            <Text style={[styles.boldText, styles.headerText]}>
                Collected Cars: {garageCars.length} / {totalAvailableCars}
            </Text>
            <Progress.Bar 
                progress={progress} 
                width={300} 
                height={20} 
                color={color} 
                style={styles.progressBar} 
                />
                <Text style={styles.collectorLevelText}>
                    Collector Level: {text}
                </Text>
                {mostExpensiveCar && (
                    <View style={styles.expensiveCarContainer}>
                        <Text style={styles.boldText}>Most Expensive Car</Text>
                        <Image 
                            source={{ uri: mostExpensiveCar.image }} 
                            style={styles.carImage} 
                        />
                        <Text style={styles.expensiveCarText}>
                            {mostExpensiveCar.brand} {mostExpensiveCar.model}, Credit: {mostExpensiveCar.credit}
                        </Text>
                    </View>
                )}
                <Text style={[styles.boldText, styles.totalGarageValueText]}>
                    Total Garage Value: {totalGarageValue} Credits
                </Text>
                <View style={styles.limitedStockContainer}>
                    <MaterialCommunityIcons name="alert" size={20} color="red" />
                    <Text style={[styles.boldText, styles.limitedStockText]}>
                        Limited Stock cars owned: {limitedStockCars}
                    </Text>
                </View>
            </View>
        );
    }