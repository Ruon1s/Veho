import React from 'react';
import { Container, Text, Form, Input, Button, Item, Label, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

const ResetPasswordForm = ({ toLogin }) => {

    const btnMargin = 8

    return (

        <Form>
            <Text> Reset password </Text>
            <Item fixedLabel>
                <Label keyboardType="email-address">Email</Label>
                <Input />
            </Item>
            <Grid>
                <Col>
                    <Button full style={{ margin: btnMargin }} >
                        <Text>
                            Reset
                            </Text>
                    </Button>
                </Col>
                <Col>
                    <Button onPress={toLogin} full transparent style={{ margin: btnMargin }} >
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