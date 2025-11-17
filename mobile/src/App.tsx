/**
 * FamilyUp iOS App
 *
 * Michigan Foster Care Awareness Platform - Mobile Edition
 * High-performance Metal graphics with React Native
 *
 * PRIVACY: Zero location tracking, aggregate county data only
 * LEGAL: COPPA, FERPA, HIPAA compliant
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import {CountyData} from './types';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1e40af',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'FamilyUp - Michigan Foster Care',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});

export default App;
