import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 4,
    },
    imageContainer: {
        borderRadius: 8,
        backgroundColor: "#000000",
    },
    image: {
        width: 350,
        height: 250,
    },
    leftText: {
        fontSize: 18,
        fontWeight: "600",
    },
    rightText: {
        fontSize: 18,
    },
    creditContainer: {
        borderRadius: 8,
        width: 350,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        backgroundColor: "#D3D3D3",
    },
    creditText: {
        fontSize: 20,
        fontStyle: "italic",
        fontWeight: "600",
    },
    addButton :{
        backgroundColor: "#1E3F5A",
        margin: 10,
        width: 200,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "#D3D3D3",
    },
    disabledButtonText: {
        color: "#000000",
    },
});

export default styles;
