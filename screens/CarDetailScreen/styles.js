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
    addButton: {
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

    flipCardContainer: {
        width: 350,
        marginBottom: 250,
        marginTop: 20,
    },
    card: {
        width: 350,
        height: 250,
    },
    face: {
        width: 350,
        height: 250,
    },
    back: {
        width: 350,
        height: 250,
        backgroundColor: "#D3D3D3",
        borderRadius: 8,
        padding: 10,
        justifyContent: "center",
    },
    backText: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    dialog: {
        width: 300,
        height: 250,
        textAlign: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
    },
    dialogText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default styles;
