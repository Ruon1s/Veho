import { Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

const ErrorText = (props) => {
    return(
        <Text style={styles.error}> 
            {props.text} 
        </Text>
    );
}

const styles = StyleSheet.create({
    error: {
        color: '#fb3664',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    }
})

export default ErrorText;
