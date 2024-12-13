// React imports
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    Alert,
    Modal,
    Linking,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

// Third party imports
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

// Project imports
import { AuthContext } from "../../context/AuthContext";
import { CarContext } from "../../context/CarContext";
import { getAllCarsFromDB } from "../../database/read";
import { auth } from "../../database/config";
import styles from "./styles";

//Languages
import { currentLngKey, supportedLanguages } from "../../i18n/i18n";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import * as database from "../../database";

/*
The UI styling and structure of this page is largely based on: https://withfra.me/components/settings
For the email Linking, the Linking API is used: https://reactnative.dev/docs/0.70/linking
*/
export default function SettingsScreen() {
    const [showModal, setShowModal] = useState(false);
    const {
        currentUser,
        setCurrentUser,
        setIsAuthenticated,
        loading,
        setLoading,
        setAuthId,
    } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [languages] = useState(getLanguagesList());
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    /* Side effects */

    /*
    Language selection state management
    */
    useEffect(() => {
        const loadLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem(currentLngKey);
            if (storedLanguage) {
                setSelectedLanguage(storedLanguage);
                i18n.changeLanguage(storedLanguage);
            }
        };
        loadLanguage();
    }, []);

    const onLanguageChange = (value) => {
        setSelectedLanguage(value);
    };

    const handleConfirmLanguage = async () => {
        try {
            await AsyncStorage.setItem(currentLngKey, selectedLanguage);
            i18n.changeLanguage(selectedLanguage);
            setShowModal(false);
        } catch (error) {
            console.log("Error saving language selection:", error);
        }
    };

    const openEmailApp = (emailPurpose) => {
        let recipients = "";
        let subject = "";
        let body = "";
        let url = "";

        if (emailPurpose === "contact") {
            recipients = ["developer1@a.com", "developer2@a.com"];
            subject = i18next.t("screens.settings.emailText.subjectGeneral");
            body = i18next.t("screens.settings.emailText.bodyGeneral", {
                nickname: currentUser.nickname,
            });

            url = `mailto:${recipients.join(",")}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
        } else if (emailPurpose === "bug") {
            recipients = ["developer1@a.com", "developer2@a.com"];
            subject = i18next.t("screens.settings.emailText.subjectBug");
            body = i18next.t("screens.settings.emailText.bodyBug", {
                nickname: currentUser.nickname,
            });

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

    /* Handlers */

    const handleLogout = () => {
        Alert.alert("Logout?", "Are you sure you want to log out?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                onPress: () => {
                    signOut(auth)
                        .then(() => {
                            // Resetting states
                            setIsAuthenticated(false);
                            setAuthId(null);
                            setCurrentUser(null);
                            setLoading(false);
                            console.log("Successfully signed out.");
                        })
                        .catch((error) => {
                            console.log("Error signing out:", error.message);
                        });
                },
            },
        ]);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleHideModal = () => {
        setShowModal(false);
    };

    const handleOpenContactEmail = () => {
        openEmailApp("contact");
    };

    const handleOpenBugEmail = () => {
        openEmailApp("bug");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.section, { paddingTop: 4 }]}>
                    <Text style={styles.sectionTitle}>
                        {i18next.t("screens.settings.account")}
                    </Text>
                    <View style={styles.sectionBody}>
                        <View style={styles.profile}>
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
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {i18next.t("screens.settings.preferences")}
                    </Text>
                    <View style={styles.sectionBody}>
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(true);
                                }}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>
                                    {i18next.t("screens.settings.language")}
                                </Text>
                                <View style={styles.rowSpacer} />
                                <Text style={styles.rowValue}>
                                    {selectedLanguage}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {i18next.t("screens.settings.email")}
                    </Text>
                    <View style={styles.sectionBody}>
                        <View style={[styles.rowWrapper, styles.rowFirst]}>
                            <TouchableOpacity
                                onPress={handleOpenContactEmail}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>
                                    {i18next.t("screens.settings.contact")}
                                </Text>
                                <View style={styles.rowSpacer} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowWrapper}>
                            <TouchableOpacity
                                onPress={handleOpenBugEmail}
                                style={styles.row}
                            >
                                <Text style={styles.rowLabel}>
                                    {i18next.t("screens.settings.reportBug")}
                                </Text>
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
                                onPress={handleLogout}
                                style={styles.row}
                            >
                                <Text
                                    style={[
                                        styles.rowLabel,
                                        styles.rowLabelLogout,
                                    ]}
                                >
                                    {i18next.t("screens.settings.logout")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonSpacer} />
                </View>
                <Text style={styles.contentFooter}>
                    {i18next.t("screens.settings.footer")}
                </Text>
            </ScrollView>

            <Modal visible={showModal} transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={handleHideModal}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.dialog}>
                                <Text style={styles.title}>
                                    {i18next.t(
                                        "screens.settings.selectLanguage"
                                    )}
                                </Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedLanguage}
                                        onValueChange={onLanguageChange}
                                    >
                                        {languages.map((lang) => (
                                            <Picker.Item
                                                key={lang.label}
                                                label={lang.label}
                                                value={lang.value}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={handleConfirmLanguage}
                                >
                                    <Text style={styles.buttonText}>
                                        {i18next.t("components.filter.apply")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

function getLanguagesList() {
    const data = [];

    for (let key in supportedLanguages) {
        data.push({
            label: `${supportedLanguages[key]} (${key})`,
            value: key,
        });
    }

    return data;
}
