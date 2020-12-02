import React from 'react';
import { Form, Item, Input, Text, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import GlobalButton from './GlobalButton';
import i18n from 'i18n-js';
import ErrorText from './ErrorText';

const AddManagerForm = (props) => {

    const {
        foundUser,
        add,
        search,
        error,
        searching,
        adding,
        handleEmailInput,
        clear
    } = props;

    return (
        <>
            <Text style={styles.titleText}>{i18n.t('addManager')}</Text>
            {foundUser ?
                adding ?
                    <Spinner />
                    :
                    <>
                        <Text>{i18n.t('foundUser')}</Text>
                        <Text>{i18n.t('email')}{foundUser.email}</Text>
                        <Text>{i18n.t('fullName')} {foundUser.firstname} {foundUser.lastname} </Text>
                        <GlobalButton
                            text={i18n.t('addAsManager')}
                            onPress={() => add(foundUser.id)} />
                        <GlobalButton
                            text={i18n.t('clear')}
                            transparent={true}
                            onPress={clear} />
                    </>
                :
                searching ?
                    <Spinner />
                    :
                    error.type === 'searchUser' ?
                        <Text style={styles.errorMessage}>{error.message}</Text>
                        :
                        <>
                            <Form>
                                <Item>
                                    <Input
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        placeholder={i18n.t('emailPlaceholder')}
                                        onChangeText={text => handleEmailInput(text)} />
                                </Item>
                            </Form>
                            <GlobalButton text={i18n.t('search')} onPress={search} />
                        </>}
        </>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default AddManagerForm;
