import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Authentication from '../views/Authentication';
import AddCarDetails from '../views/AddCarDetails';
import Home from '../views/Home';
import Settings from '../views/Settings';
import Icon from 'react-native-vector-icons/FontAwesome5'
import AdminPanel from '../views/AdminPanel';
import i18n from 'i18n-js';
import InitialLoading from '../views/InitialLoading';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let iconName;
                let color;

                switch (route.name) {
                    case i18n.t('home'): {
                        iconName = 'bolt'
                        color = focused ? '#000' : '#999999'
                        break;
                    }
                    case i18n.t('settings'): {
                        iconName = 'cog'
                        color = focused ? '#000' : '#999999'
                        break;
                    }
                }
                return <Icon name={iconName} size={24} color={color} />
            }
        })}
            tabBarOptions={{
                activeTintColor: '#000',
                inactiveTintColor: '#999999',
                activeBackgroundColor: '#FFFFFF',
                inactiveBackgroundColor: '#FFFFFF'
            }}
        >
            <Tab.Screen name={i18n.t('home')} component={Home} />
            <Tab.Screen name={i18n.t('settings')} component={Settings} />
        </Tab.Navigator>
    );
}

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Start" component={InitialLoading} />
                <Stack.Screen name='Auth' component={Authentication} />
                <Stack.Screen name='App' component={TabNavigator} />
                <Stack.Screen name='AddCarDetails' component={AddCarDetails} />
                <Stack.Screen name='AdminPanel' component={AdminPanel} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigator;
