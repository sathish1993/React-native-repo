/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, TextInput, Picker} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import TransScreen from './screens/TransScreen'
import LocScreen from './screens/LocScreen'

const MainNavigator = createStackNavigator({
  Translation: { screen: TransScreen },
  Location: { screen: LocScreen },
});

const App = createAppContainer(MainNavigator);

export default App;






