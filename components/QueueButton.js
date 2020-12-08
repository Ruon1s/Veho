import { Button, Spinner, Text } from 'native-base';
import React from 'react';
import GlobalStyles from '../styles/GlobalStyles';

const QueueButton = (props) => {
    return (
        <Button
            large={props.large}
            block
            style={{ ...props.style, ...GlobalStyles.button }}
            onPress={props.onPress}
            transparent={props.transparent}
        >
            <Text style={props.danger ? { color: '#fb3664' } : {}} > {props.text} </Text>
        </Button>
    )
}

export default QueueButton;
