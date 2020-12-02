import { Container, Root, StyleProvider, Toast, View } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import React, { useEffect, useState } from 'react';
import useAdminHooks from '../hooks/AdminHooks';
import AdminPanelSection from '../components/AdminPanelSection';
import GlobalButton from '../components/GlobalButton';
import AdminPanelModal from '../components/AdminPanelModal';
import { StyleSheet } from 'react-native';
import i18n from 'i18n-js';

const AdminPanel = ({ navigation, route }) => {
    const [managersVisible, setManagersVisible] = useState(false);      //Hide/Show managers list
    const [locationsVisible, setLocationsVisible] = useState(false);    //Hide/Show locations list
    const currentUser = route.params.user;

    const {
        managers,
        locations,
        managerQuery,
        locationQuery,
        processing,
        error,
        user,
        modalVisible,
        fetchManagers,
        fetchLocations,
        searchUser,
        clearUser,
        addManager,
        removeManager,
        addNewLocation,
        editLocation,
        removeLocation,
        switchToLocation,
        openModal,
        closeModal,
        handleManagerQueryChange,
        handleLocationQueryChange,
        handleEmailQuery,
        handleNewLocationNameChange,
        handleNewLocationPublicSpotCountChange,
        handleNewLocationDedicatedSpotCountChange,
    } = useAdminHooks();

    const showToast = (type, text) => {
        Toast.show({
            type,
            text,
            duration: 3000,
        });
    }

    useEffect(() => {
        fetchManagers();
        fetchLocations();
    }, []);

    useEffect(() => {
        if (processing.success !== '') {
            showToast('success', processing.success);
        } else if (error.message !== '') {
            showToast('warning', error.message);
        }
    }, [processing.success, error]);

    //If the admin is searching, only show the results of the query, else show all 
    const showManagers = managerQuery ? managers.filter(manager => manager.email.toLowerCase().includes(managerQuery.toLowerCase())) : managers;
    const showLocations = locationQuery ? locations.filter(location => location.name.toLowerCase().includes(locationQuery.toLowerCase())) : locations;

    return (
        <StyleProvider style={getTheme(platform)}>
            <Root>
                <Container>
                    <CustomHeader title={i18n.t('adminHeader')} handleBackButton={() => navigation.goBack()} />
                    <View style={styles.padder}>
                        <GlobalButton
                            text={managersVisible ? `${i18n.t('hideManagers')} (${managers.length})` : `${i18n.t('showManagers')} (${managers.length})`}
                            onPress={() => setManagersVisible(!managersVisible)}
                        />
                        {managersVisible ?
                            <AdminPanelSection
                                processing={processing}
                                error={error}
                                listData={showManagers}
                                addButtonText={i18n.t('addManager')}
                                addFunction={() => openModal('addManager')}
                                removeFunction={removeManager}
                                handleSearchTextChange={handleManagerQueryChange}
                                searchInputPlaceHolder="Search by email..."
                            />
                            :
                            null}

                        <GlobalButton
                            text={locationsVisible ? `${i18n.t('hideLocations')} (${locations.length})` : `${i18n.t('showLocations')} (${locations.length})`}
                            onPress={() => setLocationsVisible(!locationsVisible)}
                        />
                        {locationsVisible ?
                            <AdminPanelSection
                                processing={processing}
                                error={error}
                                listData={showLocations}
                                addButtonText={i18n.t('addLocation')}
                                addFunction={() => openModal('addLocation', false, {})}
                                handleSearchTextChange={handleLocationQueryChange}
                                searchInputPlaceHolder="Search by location name..."
                                editLocation={openModal}
                                switchToLocation={switchToLocation}
                                currentUser={currentUser}
                            />
                            :
                            null}

                        <AdminPanelModal
                            modalVisible={modalVisible}
                            closeModal={closeModal}
                            addManager={addManager}
                            addLocation={addNewLocation}
                            editLocation={editLocation}
                            removeLocation={removeLocation}
                            clearUser={clearUser}
                            foundUser={user}
                            processing={processing}
                            error={error}
                            search={searchUser}
                            handleEmailChange={handleEmailQuery}
                            handleLocationNameChange={handleNewLocationNameChange}
                            handleNewLocationPublicSpotCountChange={handleNewLocationPublicSpotCountChange}
                            handleNewLocationDedicatedSpotCountChange={handleNewLocationDedicatedSpotCountChange}
                        />
                    </View>
                </Container>
            </Root>
        </StyleProvider>
    );
}

const styles = StyleSheet.create({
    padder: {
        padding: 10,
    },
});

export default AdminPanel;
