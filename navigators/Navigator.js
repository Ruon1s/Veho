import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../views/Authentication';
import AddCarDetails from '../views/AddCarDetails';
import Home from '../views/Home';
import Settings from '../views/Settings';
import ChargingView from '../views/ChargingView';
import Icon from 'react-native-vector-icons/FontAwesome'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: () => {
                let iconName;

                switch (route.name) {
                    case 'Home': iconName = 'home'
                        break;
                    case 'Settings': iconName = 'cog'
                        break;
                }

                return <Icon name={iconName} size={24} />
            }
        })
        }>
            <Tab.Screen name='Home' component={Home} />
            <Tab.Screen name='Settings' component={Settings} />
        </Tab.Navigator>
    );
}

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Auth' component={Authentication} />
                <Stack.Screen name='App' component={TabNavigator} />
                <Stack.Screen name='AddCarDetails' component={AddCarDetails} />
                <Stack.Screen name='ChargingView' component={ChargingView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigator;
