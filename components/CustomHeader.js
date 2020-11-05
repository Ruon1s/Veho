import React, { useEffect, useState } from 'react';
import { Container, Content, Text, Button, View, StyleProvider, Header, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { useLinkProps } from '@react-navigation/native';

// For cleaner code, need in many views anyway
const CustomHeader = (props) => {
    return (<Header>
        <Body>
            <Title>{props.title}</Title>
        </Body>
    </Header>)
};

export default CustomHeader;