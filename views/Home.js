import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
    return (
        <View style={ styles.center }>
            <Text>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Home;