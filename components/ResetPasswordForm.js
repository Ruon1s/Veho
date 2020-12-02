import React from 'react';
import { Container, Text, Form, Input, Button, Item, Label, Content } from 'native-base';
import GlobalStyles from '../styles/GlobalStyles';
import { Col, Row, Grid } from 'react-native-easy-grid';
import i18n from 'i18n-js';

const ResetPasswordForm = ({ toLogin }) => {
    return (
        <Form>
            <Item floatingLabel>
                <Label keyboardType="email-address">{i18n.t('email')}</Label>
                <Input />
            </Item>
            <Grid>
                <Col>
                    <Button full style={GlobalStyles.button} >
                        <Text>
                            {i18n.t('reset')}
                        </Text>
                    </Button>
                </Col>
                <Col>
                    <Button onPress={toLogin} full transparent style={GlobalStyles.button} >
                        <Text>
                            {i18n.t('back')}
                        </Text>
                    </Button>
                </Col>
            </Grid>
        </Form>
    );
}

export default ResetPasswordForm