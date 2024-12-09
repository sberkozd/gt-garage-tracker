// React imports
import React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

// Third party imports
import { signOut } from "firebase/auth";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

// Project imports
import { AuthContext } from "../../context/AuthContext";
import * as database from "../../database";
import { auth } from "../../database/config";

export default function GarageSummaryScreen() {
    const navigation = useNavigation();
    const { setIsAuthenticated, setAuthId } = useContext(AuthContext);

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
    }, [navigation]);

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

    return (
        <View>
            <Text>Garage Summary Screen</Text>
        </View>
    );
}
