// React imports
import React, { useState, useEffect } from "react";
import { View, Text, Modal, Switch, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

// Third-party imports
import { Picker } from "@react-native-picker/picker";

// In-project imports
import styles from "./styles";

export default function CarFilterDialog({
    visible,
    onClose,
    onApply,
    limitedStock,
  }) {
    const defaultPpRange = "0-1500";
    const defaultCreditRange = "0-500000";
    const [localLimitedStock, setLocalLimitedStock] = useState(limitedStock);
    const [selectedPpRange, setSelectedPpRange] = useState(defaultPpRange);
    const [selectedCreditRange, setSelectedCreditRange] = useState(defaultCreditRange);
  
    useEffect(() => {
      setLocalLimitedStock(limitedStock);
    }, [limitedStock]);
  
    const handleApply = () => {
      const [minPp, maxPp] = selectedPpRange.split("-").map(Number);
      const [minCredit, maxCredit] = selectedCreditRange.split("-").map(Number);
  
      console.log("Applying Filters:");
      console.log("minPp:", minPp, "maxPp:", maxPp);
      console.log("minCredit:", minCredit, "maxCredit:", maxCredit);
  
      onApply({
        limitedStock: localLimitedStock,
        minPp,
        maxPp,
        minCredit,
        maxCredit,
      });
      onClose();
    };
  
    const resetFilters = () => {
      setLocalLimitedStock(false);
      setSelectedPpRange(defaultPpRange);
      setSelectedCreditRange(defaultCreditRange);
      const [minPp, maxPp] = defaultPpRange.split("-").map(Number);
      const [minCredit, maxCredit] = defaultCreditRange.split("-").map(Number);
      onApply({ limitedStock: false, minPp, maxPp, minCredit, maxCredit });
      onClose();
    };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>Filter Options</Text>
              <View style={styles.switchContainer}>
                <Switch
                  value={localLimitedStock}
                  onValueChange={setLocalLimitedStock}
                />
                <Text style={styles.switchLabel}>Show Limited Stock only</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select PP Range</Text>
                <Picker
                  selectedValue={selectedPpRange}
                  onValueChange={(itemValue) =>
                    setSelectedPpRange(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="0-200" value="0-200" />
                  <Picker.Item label="200-300" value="200-300" />
                  <Picker.Item label="300-400" value="300-400" />
                  <Picker.Item label="400-500" value="400-500" />
                  <Picker.Item label="500-600" value="500-600" />
                  <Picker.Item label="600-700" value="600-700" />
                  <Picker.Item label="700-800" value="700-800" />
                  <Picker.Item label="800-900" value="800-900" />
                  <Picker.Item label="900-1000" value="900-1000" />
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Credit Range</Text>
                <Picker
                  selectedValue={selectedCreditRange}
                  onValueChange={(itemValue) =>
                    setSelectedCreditRange(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="0-50,000" value="0-50000" />
                  <Picker.Item label="50,000-100,000" value="50000-100000" />
                  <Picker.Item label="100,000-200,000" value="100000-200000" />
                  <Picker.Item label="200,000-300,000" value="200000-300000" />
                  <Picker.Item label="300,000-400,000" value="300000-400000" />
                  <Picker.Item label="400,000-500,000" value="400000-500000" />
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
  