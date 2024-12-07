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
});

export default styles;
