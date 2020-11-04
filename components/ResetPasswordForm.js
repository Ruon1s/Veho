import React from 'react';
import { Container, Text, Form, Input, Button, Item, Label, Content } from 'native-base';
import GlobalStyles from '../styles/GlobalStyles';
import { Col, Row, Grid } from 'react-native-easy-grid';

const ResetPasswordForm = ({ toLogin }) => {
    return (
        <Form>
            <Text> Reset password </Text>
            <Item fixedLabel>
                <Label keyboardType="email-address">Email</Label>
                <Input />
            </Item>
            <Grid>
                <Col>
                    <Button full style={GlobalStyles.button} >
                        <Text>
                            Reset
                            </Text>
                    </Button>
                </Col>
                <Col>
                    <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                        <Text>
                            Back
                            </Text>
                    </Button>
                </Col>
            </Grid>
        </Form>

    );
}

export default ResetPasswordForm