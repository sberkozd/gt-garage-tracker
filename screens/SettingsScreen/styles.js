import { StyleSheet } from "react-native";

/*
Styling of the Settings screen
Most of these styles come: https://withfra.me/components/settings
*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    /** Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: "600",
        color: "#000",
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        textAlign: "center",
    },
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
        color: "#a69f9f",
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionTitle: {
        margin: 8,
        marginLeft: 12,
        fontSize: 13,
        letterSpacing: 0.33,
        fontWeight: "500",
        color: "#a69f9f",
        textTransform: "uppercase",
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    /** Profile */
    profile: {
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileBody: {
        marginRight: "auto",
    },
    profileName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#292929",
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: "400",
        color: "#858585",
    },
    /** Row */
    row: {
        height: 44,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 12,
    },
    rowWrapper: {
        paddingLeft: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#f0f0f0",
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLabel: {
        fontSize: 16,
        letterSpacing: 0.24,
        color: "#000",
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#ababab",
        marginRight: 4,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
        width: "100%",
        textAlign: "center",
        fontWeight: "600",
        color: "#dc2626",
    },
    /** Added */
    buttonSpacer: {
        marginVertical: 10,
    },

    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    dialog: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    switchLabel: {
        marginLeft: 10,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: 250,
    },
    applyButton: {
        backgroundColor: "#6200EE",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    resetButton: {
        backgroundColor: "#B00020",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});

export default styles;
