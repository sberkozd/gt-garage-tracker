// React imports
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
} from "react-native";

// Third party imports
import { signOut } from "firebase/auth";
import LottieView from "lottie-react-native";

// Project imports
import { AuthContext } from "../../context/AuthContext";
import { CarContext } from "../../context/CarContext";
import { getAllCarsFromDB } from "../../database/read";
import { auth } from "../../database/config";
import styles from "./styles";

/*
The UI styling and structure of this page is largely based on: https://withfra.me/components/settings
For the email Linking, the Linking API is used: https://reactnative.dev/docs/0.70/linking
*/
export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const openEmailApp = (emailPurpose) => {
        let recipients = "";
        let subject = "";
        let body = "";
        let url = "";

        if (emailPurpose === "contact") {
            recipients = ["developer1@a.com", "developer2@a.com"];
            subject = "[GT Garage Tracker App] General query";
            body =
                "Hello,\n\nI just wanted to send an email about your GT Garage Tracker app.";

            url = `mailto:${recipients.join(",")}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
        } else if (emailPurpose === "bug") {
            recipients = ["developer1@a.com", "developer2@a.com"];
            subject = "[GT Garage Tracker App] Bug found!";
            body = `Hi!,
            \n\nI just wanted to send you guys an email about a bug we found in your GT Garage Tracker app.
            \n\n The steps to reproduce this bug are as follows:
            \n\n App version: v1.0.0 beta
            \n\n Version of Android/iOS:
            \n\n Thanks,
            \n ${currentUser.nickname}`;

            url = `mailto:${recipients.join(",")}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
        }

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert(
                        "Email Error",
                        `You have no supported email app installed, please email developer1@a.com
                        and/or developer2@a.com directly.`
                    );
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(() => {
                Alert.alert(
                    "Email Error",
                    `An error occured, please email developer1@a.com
                    and/or developer2@a.com directly.`
                );
            });
    };

    const handleOpenContactEmail = () => {

        openEmailApp("contact");
    };

    const handleOpenBugEmail = () => {

        openEmailApp("bug");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <View style={styles.header}>
                <View style={styles.headerAction}>
                    <TouchableOpacity
                        onPress={() => {
                            // handle onPress
                        }}
                    >
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={1} style={styles.headerTitle}></Text>
                <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
                    <TouchableOpacity
                        onPress={() => {
                            // handle onPress
                        }}
                    >
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.section, { paddingTop: 4 }]}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.sectionBody}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}
                            style={styles.profile}
                        >
                            <LottieView
                                autoPlay
                                loop
                                source={require("../../assets/helmetAnimation.json")}
                                style={styles.profileAvatar}
                            />
                            <View style={styles.profileBody}>
                                <Text style={styles.profileName}>
                                    {currentUser.nickname}
                                </Text>
                                <Text style={styles.profileHandle}>
                                    {currentUser.email}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.sectionBody}>
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>Language</Text>
                                <View style={styles.rowSpacer} />
                                <Text style={styles.rowValue}>English</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.rowWrapper, styles.rowLast]}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>
                                    Dark Mode
                                </Text>
                                <View style={styles.rowSpacer} />
                                <Switch
                                    onValueChange={(newValue) =>
                                        setDarkMode(newValue)
                                    }
                                    style={{
                                        transform: [
                                            { scaleX: 0.95 },
                                            { scaleY: 0.95 },
                                        ],
                                    }}
                                   value={darkMode}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Email</Text>
                    <View style={styles.sectionBody}>
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={handleOpenContactEmail}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>Contact Us</Text>
                                <View style={styles.rowSpacer} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={handleOpenBugEmail}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>Report Bug</Text>
                                <View style={styles.rowSpacer} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionBody}>
                        <View
                            style={[
                                styles.rowWrapper,
                                styles.rowFirst,
                                styles.rowLast,
                                { alignItems: "center" },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}
                            >
                                <Text
                                    style={[
                                        styles.rowLabel,
                                        styles.rowLabelLogout,
                                    ]}
                                >
                                    Log Out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonSpacer} />

                    <View style={styles.sectionBody}>
                        <View
                            style={[
                                styles.rowWrapper,
                                styles.rowFirst,
                                styles.rowLast,
                                { alignItems: "center" },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}
                                style={styles.row}
                            >
                                <Text
                                    style={[
                                        styles.rowLabel,
                                        styles.rowLabelLogout,
                                    ]}
                                >
                                    DELETE ACCOUNT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={styles.contentFooter}>
                    {`v1.0.0 Beta
                    \n\nAggrey Nhiwatiwa, Samet Berk Ozdemir 
                    \n\n© Copyright 2024`}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
