/*
Styles for the LoginScreen component
*/
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "rgba(255, 231, 51, 0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    textInputContainer: {
        color: "#000000",
        backgroundColor: "#EFEFEF",
        height: 50,
        width: 280,
        borderRadius: 5,
        paddingLeft: 10,
        //borderColor: "#FFAA33",
        borderWidth: 2,
    },
    footer: {
        position: "absolute",
        paddingBottom: 20,
        bottom: 40,
        zIndex: -2, //Needed so that outer toast shows above footer
    },
    modalView: {
        backgroundColor: "rgba(255, 231, 51, 0.5)",
        alignSelf: "stretch",
        marginTop: 150,
        margin: 20,
        padding: 10,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#D3D3D3",
        zIndex: -1,
        alignItems: "center",
    },
    modalButton: {
        //backgroundColor: "#1E3F5A",
        backgroundColor: "#595959",
        margin: 10,
        width: 200,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    disabledButton: {
        //backgroundColor: "#000000",
        opacity: 0.4,
    },
    loginButton: {
        backgroundColor: "#FFAA33",
    },
    closeButton: {
        backgroundColor: "#B5271D",
    },
    signupButton: {
        backgroundColor: "#8B0000",
        position: "absolute",
        bottom: 40,
    },
    deleteButton: {
        backgroundColor: "red",
    },
    modalButtonText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    image: {
        flex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.8,
    },
    buttonImage: {
        borderRadius: 4,
    },
    footerText: {
        color: "#FFFFFF",
    },
});

export default styles;
