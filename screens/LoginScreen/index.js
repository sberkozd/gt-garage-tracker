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

    const { setIsAuthenticated, setAuthId } = useContext(AuthContext);

    /*
    Ensures that there are no active users signed in when the login page is entered
    */
    useEffect(() => {
        signOut(auth)
            .then(() => {
                showSuccessToast("Successfully signed out");
            })
            .catch(() => {
                showErrorToast("Error signing users out");
            });
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
            setEmailErrTxt("Please enter a valid email");
            setPasswordResetBtnDisabled(true);
            //setSignUpBtnDisabled(true);
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
            setPwdErrTxt("Please enter a password");
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
            setNicknameErrTxt("Please enter a nickname");
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
                showSuccessToast("Login successful");
            })
            .catch(() => {
                showErrorToast("Incorrect username or password");
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
                    showErrorToast("The Email you entered is already in use.");
                } else if (error.code === "auth/weak-password") {
                    showErrorToast("Please enter a stronger password.");
                } else {
                    showErrorToast(
                        "An error occured while signing up, please try again."
                    );
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
                showSuccessToast("Password reset via email requested");
            })
            .catch(() => {
                showErrorToast(
                    "There was an error, sending the link, please try again"
                );
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
            text1: "Success ✅",
            text2: msg,
            topOffset: 60,
        });
    };

    const showErrorToast = (errMsg) => {
        Toast.show({
            type: "error",
            text1: "Error 🛑",
            text2: errMsg,
            visibilityTime: 2200,
            topOffset: 60,
        });
    };

    return (
        <>
            <View style={styles.container} setCredentials={setCredentials}>
                <ImageBackground
                    source={{ uri: "https://wallpapers.com/images/hd/garage-background-lsvpd9p5e1h34yi6.jpg" }}
                    resizeMode="cover"
                    style={styles.image}
                >
                    <TextInput
                        style={styles.textInputContainer}
                        placeholder="Email Address"
                        onChangeText={handleEmailChange}
                        keyboardType={"email"}
                        autoCapitalize="none"
                    />

                    <InputMsgBox text={emailErrTxt}></InputMsgBox>

                    <TextInput
                        style={styles.textInputContainer}
                        placeholder="Password"
                        onChangeText={handlePwdChange}
                        secureTextEntry={true}
                        value={pwd}
                    />

                    <InputMsgBox text={pwdErrTxt}></InputMsgBox>

                    <ImageBackground
                    source={{ uri: "https://media.istockphoto.com/id/1369079055/vector/vector-carbon-kevlar-fiber-pattern-texture-background.jpg?s=612x612&w=0&k=20&c=y5mEysSCmAgpRhNmQ51Rquyt5i3cKz8I1AEADEvr4Mo=" }}
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
                        <Text style={styles.modalButtonText}>Enter Garage</Text>
                    </Pressable>

                    </ImageBackground>

                    <Pressable
                        style={styles.modalButton}
                        onPress={handleForgotPasswordPress}
                    >
                        <Text style={styles.modalButtonText}>
                            Forgot Password?
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.modalButton, styles.signupButton]}
                        onPress={handleSignUpPress}
                    >
                        <Text style={styles.modalButtonText}>Sign up</Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Aggrey Nhiwatiwa + Berk Ozdemir © Copyright 2024
                        </Text>
                    </View>
                
                

                <Modal animationType="slide" visible={showModal}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.textInputContainer}
                            placeholder="Email Address"
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
                                Request Reset
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={handleModalToggle}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </Pressable>
                    </View>
                    <Toast />
                </Modal>

                <Modal animationType="slide" visible={showSignUpModal}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.textInputContainer}
                            placeholder="Nickname"
                            onChangeText={handleNicknameChange}
                            value={nickname}
                        />

                        <InputMsgBox text={nicknameErrTxt}></InputMsgBox>

                        <TextInput
                            style={styles.textInputContainer}
                            placeholder="Email Address"
                            onChangeText={handleEmailChange}
                            value={email}
                            keyboardType={"email"}
                            autoCapitalize="none"
                        />

                        <InputMsgBox text={emailErrTxt}></InputMsgBox>

                        <TextInput
                            style={styles.textInputContainer}
                            placeholder="Password"
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
                            <Text style={styles.modalButtonText}>Sign Up</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={handleSignUpModalToggle}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </Pressable>
                    </View>
                    <Toast />
                </Modal>
                </ImageBackground>
            </View>
        </>
    );
}
