import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dialog: {
        width: 300,
        height: 200,
        textAlign: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
    },
    dialogText: {
        fontSize: 16,
    },
});

export default styles;
