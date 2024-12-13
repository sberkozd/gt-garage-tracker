// React imports
import { useContext, useEffect, useState } from "react";
import {
    ImageBackground,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

// Third party imports
import Toast from "react-native-toast-message";
import { auth } from "../../database/config";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

// Project imports
import styles from "./styles";
import { AuthContext } from "../../context/AuthContext";
import * as database from "../../database";
import InputMsgBox from "../../components/InputMsgBox";
import i18next from "i18next";

/*
A component that uses Firebase Auth to allow users to sign up,
sign in and even change their password for the app.
Regex is used to validate user nickname, email and password inputs
*/
export default function LoginScreen({ setCredentials }) {
    /* State */
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const [nicknameErrTxt, setNicknameErrTxt] = useState("");
    const [emailErrTxt, setEmailErrTxt] = useState("");
    const [pwdErrTxt, setPwdErrTxt] = useState("");

    const [nicknameIsValid, setNicknameIsValid] = useState(false);
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [pwdIsValid, setPwdIsValid] = useState(false);

    const [loginBtnDisabled, setLoginBtnDisabled] = useState(true);
    const [signUpBtnDisabled, setSignUpBtnDisabled] = useState(true);
    const [passwordResetBtnDisabled, setPasswordResetBtnDisabled] =
        useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const { setIsAuthenticated, authId, setAuthId } = useContext(AuthContext);

    /*
    Set as authenticated, which stops the login screen being shown
    if a user is already authenticated
    */
    useEffect(() => {
        if (authId) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    /*
    Tracks whenever the username or pwd changes and conducts the sanity check
    */
    useEffect(() => {
        updateLoginButtonState();
        updateSignupButtonState();
    }, [emailIsValid, pwdIsValid, nicknameIsValid]);

    /* Handlers */
    const handleForgotPasswordPress = () => {
        handleModalToggle();
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleSignUpModalToggle = () => {
        setShowSignUpModal(!showSignUpModal);
    };

    /*
    Sanity check for email
    Regex pattern obtained via https://regexr.com/
    */
    const handleEmailChange = (value) => {
        setEmail(value);

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const emailRegexTest = emailRegex.test(value);

        if (emailRegexTest == false) {
            setEmailIsValid(false);
            setEmailErrTxt(i18next.t("errors.login.invalidEmail"));
            setPasswordResetBtnDisabled(true);
        } else {
            setEmailIsValid(true);
            setEmailErrTxt("");
            setPasswordResetBtnDisabled(false);
        }
    };

    /* Sanity check for pwd */
    const handlePwdChange = (value) => {
        setPwd(value);

        if (value.length === 0) {
            setPwdIsValid(false);
            setPwdErrTxt(i18next.t("errors.login.noPassword"));
        } else {
            setPwdIsValid(true);
            setPwdErrTxt("");
        }
    };

    /* Sanity check for nickname */
    const handleNicknameChange = (value) => {
        setNickname(value);

        if (value.length === 0) {
            setNicknameIsValid(false);
            setNicknameErrTxt(i18next.t("errors.login.nickname"));
        } else {
            setNicknameIsValid(true);
            setNicknameErrTxt("");
        }
    };

    /*
    Attempts to sign user in to db
    */
    const handleLoginPress = () => {
        signInWithEmailAndPassword(auth, email, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                setAuthId(user.uid);
                setIsAuthenticated(true);
                showSuccessToast(i18next.t("loginScreen.success"));
            })
            .catch(() => {
                showErrorToast(i18next.t("errors.login.invalidCredentials"));
                handlePwdChange("");
            });
    };

    const handleSignUpPress = () => {
        setShowSignUpModal();
    };

    /*
    When the sign up button is pressed, the input is validated
    Then the errors from Firebase (if any) are displayed to the user
    https://firebase.google.com/docs/auth/admin/errors

    If successful, the new user is added to the "users" collection in the db.
    And then the user is automatically logged in
    */
    const handleSignUpConfirm = () => {
        createUserWithEmailAndPassword(auth, email, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                database.addUserToDB(nickname, email, user.uid);
                setAuthId(user.uid);
                setIsAuthenticated(true);
                showSuccessToast("Account created successfully");
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    showErrorToast(i18next.t("errors.email.inUse"));
                } else if (error.code === "auth/weak-password") {
                    showErrorToast(i18next.t("errors.email.weakPassword"));
                } else {
                    showErrorToast(i18next.t("errors.generic"));
                }
                handlePwdChange("");
            });
    };

    /*
    Sends a password reset email if the email is registered in the DB
    Due to security, theres no way in Firebase to sanity check whether an email is in the DB 
    before the request is made
    */
    const handleSendPasswordResetLink = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showSuccessToast(
                    `${i18next.t("loginScreen.passwordResetSuccess")}`
                );
            })
            .catch(() => {
                showErrorToast(`${i18next.t("errors.generic")}`);
            });
    };

    /*
    Helper function for changing the login button state depending
    on whether the user input is valid
    */
    const updateLoginButtonState = () => {
        if (emailIsValid && pwdIsValid) {
            setLoginBtnDisabled(false);
        } else {
            setLoginBtnDisabled(true);
        }
    };

    const updateSignupButtonState = () => {
        if (emailIsValid && pwdIsValid && nicknameIsValid) {
            setSignUpBtnDisabled(false);
        } else {
            setSignUpBtnDisabled(true);
        }
    };

    /* Toast logic */
    const showSuccessToast = (msg) => {
        Toast.show({
            type: "success",
            text1: `${i18next.t("loginScreen.success", { icon: "✅" })}`,
            text2: msg,
            topOffset: 60,
        });
    };

    const showErrorToast = (errMsg) => {
        Toast.show({
            type: "error",
            text1: `${i18next.t("loginScreen.error", { icon: "🛑" })}`,
            text2: errMsg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    return (
        <>
            <View style={styles.container} setCredentials={setCredentials}>
                <ImageBackground
                    source={{
                        uri: "https://wallpapers.com/images/hd/garage-background-lsvpd9p5e1h34yi6.jpg",
                    }}
                    resizeMode="cover"
                    style={styles.image}
                >
                    <TextInput
                        style={styles.textInputContainer}
                        placeholder={i18next.t("loginScreen.email")}
                        onChangeText={handleEmailChange}
                        keyboardType={"email"}
                        autoCapitalize="none"
                    />

                    <InputMsgBox text={emailErrTxt}></InputMsgBox>

                    <TextInput
                        style={styles.textInputContainer}
                        placeholder={i18next.t("loginScreen.password")}
                        onChangeText={handlePwdChange}
                        secureTextEntry={true}
                        value={pwd}
                    />

                    <InputMsgBox text={pwdErrTxt}></InputMsgBox>

                    <ImageBackground
                        source={{
                            uri: "https://media.istockphoto.com/id/1369079055/vector/vector-carbon-kevlar-fiber-pattern-texture-background.jpg?s=612x612&w=0&k=20&c=y5mEysSCmAgpRhNmQ51Rquyt5i3cKz8I1AEADEvr4Mo=",
                        }}
                        resizeMode="cover"
                        style={styles.buttonImage}
                    >
                        <Pressable
                            style={[
                                styles.modalButton,
                                styles.loginButton,
                                loginBtnDisabled && styles.disabledButton,
                            ]}
                            onPress={handleLoginPress}
                            disabled={loginBtnDisabled}
                        >
                            <Text style={styles.modalButtonText}>
                                {i18next.t("loginScreen.enterGarage")}
                            </Text>
                        </Pressable>
                    </ImageBackground>

                    <Pressable
                        style={styles.modalButton}
                        onPress={handleForgotPasswordPress}
                    >
                        <Text style={styles.modalButtonText}>
                            {i18next.t("loginScreen.forgotPassword")}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.modalButton, styles.signupButton]}
                        onPress={handleSignUpPress}
                    >
                        <Text style={styles.modalButtonText}>
                            {i18next.t("loginScreen.signUp")}`
                        </Text>
                    </Pressable>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showModal}
                    >
                        <View style={[styles.modalView, styles.modalViewSmall]}>
                            <TextInput
                                style={styles.textInputContainer}
                                placeholder={i18next.t("loginScreen.email")}
                                onChangeText={handleEmailChange}
                                value={email}
                                keyboardType={"email"}
                                autoCapitalize="none"
                            />

                            <InputMsgBox text={emailErrTxt}></InputMsgBox>

                            <Pressable
                                style={[
                                    styles.modalButton,
                                    styles.loginButton,
                                    passwordResetBtnDisabled &&
                                        styles.disabledButton,
                                ]}
                                onPress={handleSendPasswordResetLink}
                                disabled={passwordResetBtnDisabled}
                            >
                                <Text style={styles.modalButtonText}>
                                    {i18next.t("loginScreen.sendPasswordReset")}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modalButton, styles.closeButton]}
                                onPress={handleModalToggle}
                            >
                                <Text style={styles.modalButtonText}>
                                    {i18next.t("common.close")}
                                </Text>
                            </Pressable>
                        </View>
                        <Toast />
                    </Modal>

                    <Modal
                        style={styles.modal}
                        animationType="slide"
                        transparent={true}
                        visible={showSignUpModal}
                    >
                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.textInputContainer}
                                placeholder={i18next.t("loginScreen.nickname")}
                                onChangeText={handleNicknameChange}
                                value={nickname}
                            />

                            <InputMsgBox text={nicknameErrTxt}></InputMsgBox>

                            <TextInput
                                style={styles.textInputContainer}
                                placeholder={i18next.t("loginScreen.email")}
                                onChangeText={handleEmailChange}
                                value={email}
                                keyboardType={"email"}
                                autoCapitalize="none"
                            />

                            <InputMsgBox text={emailErrTxt}></InputMsgBox>

                            <TextInput
                                style={styles.textInputContainer}
                                placeholder={i18next.t("loginScreen.password")}
                                onChangeText={handlePwdChange}
                                secureTextEntry={true}
                                value={pwd}
                            />

                            <InputMsgBox text={pwdErrTxt}></InputMsgBox>

                            <Pressable
                                style={[
                                    styles.modalButton,
                                    styles.loginButton,
                                    signUpBtnDisabled && styles.disabledButton,
                                ]}
                                onPress={handleSignUpConfirm}
                                disabled={signUpBtnDisabled}
                            >
                                <Text style={styles.modalButtonText}>
                                    {i18next.t("loginScreen.signUp")}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modalButton, styles.closeButton]}
                                onPress={handleSignUpModalToggle}
                            >
                                <Text style={styles.modalButtonText}>
                                    {i18next.t("loginScreen.close")}
                                </Text>
                            </Pressable>
                        </View>
                        <Toast />
                    </Modal>
                </ImageBackground>
            </View>
        </>
    );
}
