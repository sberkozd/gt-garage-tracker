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



    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
    },

    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
    },
    animatedContainer: {
        width: "100%",
        height: "100%",
    },
    loadingDialog: {
        width: 300,
        height: 100,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: "#FFAA33",
    },

    image: {
        // Shorthand for Position absolute, all to 0
      ...StyleSheet.absoluteFillObject, 
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,

        backgroundColor: "#000000",
    },
});

export default styles;
