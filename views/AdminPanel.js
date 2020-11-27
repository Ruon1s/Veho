import { Container, StyleProvider, View } from 'native-base';
import CustomHeader from '../components/CustomHeader';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import React, { useEffect, useState } from 'react';
import useAdminHooks from '../hooks/AdminHooks';
import AdminPanelSection from '../components/AdminPanelSection';
import GlobalButton from '../components/GlobalButton';
import AdminPanelModal from '../components/AdminPanelModal';
import { StyleSheet } from 'react-native';

const AdminPanel = ({ navigation }) => { 
    const [managersVisible, setManagersVisible] = useState(false);      //Hide/Show managers list
    const [locationsVisible, setLocationsVisible] = useState(false);    //Hide/Show locations list

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
        addManager,
        removeManager,
        addNewLocation,
        editLocation,
        removeLocation,
        openModal,
        closeModal,
        handleManagerQueryChange,
        handleLocationQueryChange,
        handleEmailQuery,
        handleNewLocationNameChange,
        handleNewLocationPublicSpotCountChange,
        handleNewLocationDedicatedSpotCountChange,
    } = useAdminHooks();

    useEffect(() => {
        fetchManagers();
        fetchLocations();
    }, []);

    //If the admin is searching, only show the results of the query, else show all 
    const showManagers = managerQuery ? managers.filter(manager => manager.email.toLowerCase().includes(managerQuery.toLowerCase())) : managers;
    const showLocations = locationQuery ? locations.filter(location => location.name.toLowerCase().includes(locationQuery.toLowerCase())) : locations;

    return (
        <StyleProvider style={ getTheme(platform) }>
            <Container>
                <CustomHeader title='Admin Panel' handleBackButton={ () => navigation.goBack() } />
                <View style={styles.padder}>
                    <GlobalButton 
                        text={managersVisible ? `Hide Managers (${managers.length})` : `Show Managers (${managers.length})`}
                        onPress={() => setManagersVisible(!managersVisible)}
                     />
                    {managersVisible ?
                    <AdminPanelSection
                        processing={processing}
                        error={error}
                        listData={ showManagers }
                        addButtonText="Add a manager"
                        addFunction={ () => openModal('addManager') }
                        removeFunction={ removeManager }
                        handleSearchTextChange={handleManagerQueryChange}
                        searchInputPlaceHolder="Search by email..."
                    />
                    :
                    null}

                    <GlobalButton 
                        text={locationsVisible ? `Hide Locations (${locations.length})` : `Show Locations (${locations.length})`}
                        onPress={() => setLocationsVisible(!locationsVisible)} 
                     />
                    {locationsVisible ?
                    <AdminPanelSection
                        processing={processing}
                        error={error}
                        listData={showLocations}
                        addButtonText="Add a location"
                        addFunction={() => openModal('addLocation', false, {})}
                        handleSearchTextChange={handleLocationQueryChange}
                        searchInputPlaceHolder="Search by location name..."
                        editLocation={openModal}
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
        </StyleProvider>
    );
}

const styles = StyleSheet.create({
    padder: {
        padding: 10,
    },
});

export default AdminPanel;
