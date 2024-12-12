import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    boldText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    headerText: {
        fontSize: 20,
        marginBottom: 20,
    },
    progressBar: {
        marginVertical: 20,
    },
    collectorLevelText: {
        fontSize: 16,
        marginVertical: 10,
    },
    expensiveCarContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    carImage: {
        width: 400,
        height: 200,
        marginBottom: 10,
    },
    expensiveCarText: {
        fontSize: 18,
        textAlign: 'center',
    },
    totalGarageValueText: {
        marginTop: 20,
    },
    limitedStockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    limitedStockText: {
        fontSize: 18,
        lineHeight: 30,
        marginLeft: 10
    },
});

export default styles;