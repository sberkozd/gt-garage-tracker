import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CarsScreen from './CarsScreen';
import CarDetailScreen from './CarDetailScreen';

const CarsStack = createStackNavigator();

const CarsStackNavigator = () => {
  return (
    <CarsStack.Navigator>
      <CarsStack.Screen
        name="CarsList"
        component={CarsScreen}
        options={{ headerTitle: 'Available Cars' }}
      />
      <CarsStack.Screen
        name="CarDetail"
        component={CarDetailScreen}
        options={{ headerTitle: 'Car Detail' }}
      />
    </CarsStack.Navigator>
  );
};

export default CarsStackNavigator;