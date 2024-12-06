import React, { useContext } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { CarContext } from '../context/CarContext'; 
import styles from '../components/Car/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CarsScreen = () => {
  const { cars } = useContext(CarContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{`${item.brand} ${item.model} '${item.year}`}</Text>
        <View style={styles.chipContainer}>
          <Text style={styles.chip}>{`PP ${item.pp}`}</Text>
          <Text style={styles.drivetrain}>{item.drivetrain}</Text>
        </View>
        {item.isLimitedStock && (
          <View style={styles.limitedStockContainer}>
            <Icon name="warning" size={20} color="red" />
            <Text style={styles.limitedStockText}>Limited Stock</Text>
          </View>
        )}
        <View style={styles.creditContainer}>
          <Text style={styles.creditLabel}>Cr. </Text>
          <Text style={styles.credit}>{item.credit}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={cars}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default CarsScreen;