import React from 'react';
import { Header, Body, Title, Left, Right, Button, Subtitle, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { StyleSheet } from 'react-native';

// For cleaner code, need in many views anyway
const CustomHeader = (props) => {
    return (<Header>
        <Left>
            {props.handleBackButton && <Button transparent onPress={props.handleBackButton}>
                <Icon name='arrow-left' size={25} color={'#FFF'} />
            </Button>}
        </Left>
        <Body>
            <Title style={styles.white}>{props.title}</Title>

            {props.subtitle && <Subtitle style={styles.white}>{props.subtitle.firstname}</Subtitle>}

        </Body>
        <Right />
    </Header>)
};

const styles = StyleSheet.create({
    white: {
        color: 'white'
    }
});

export default CustomHeader;
