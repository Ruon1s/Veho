import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../views/Authentication';
import Home from '../views/Home';
import Settings from '../views/Settings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Home' component={ Home } />
            <Tab.Screen name='Settings' component={ Settings } />
        </Tab.Navigator>
    )
}

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Auth' component={ Authentication } />
                <Stack.Screen name='App' component={ TabNavigator } />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigator;
