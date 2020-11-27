import { Text, View } from 'native-base';
import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import AddManagerForm from './AddManagerForm';
import AddOrEditLocationForm from './AddOrEditLocationForm';
import GlobalButton from './GlobalButton';

const AdminPanelModal = (props) => {
    const{
        modalVisible,
        closeModal,
        addManager,
        addLocation,
        foundUser,
        handleEmailChange,
        search,
        processing,
        error,
        handleLocationNameChange,
        handleNewLocationPublicSpotCountChange,
        handleNewLocationDedicatedSpotCountChange,
        removeLocation,
        editLocation,
    } = props;

    return(
        <Modal
            visible={modalVisible.visible}
            transparent
            animationType="slide"
        >
            <View style={styles.modalContent}>
                {modalVisible.type === 'addManager' ?
                <AddManagerForm
                    search={search}
                    add={addManager}
                    searching={processing.searching}
                    adding={processing.adding}
                    handleEmailInput={handleEmailChange}
                    foundUser={foundUser}
                    error={error}
                />
                :
                <AddOrEditLocationForm 
                    addLocation={addLocation}
                    location={modalVisible.object}
                    adding={processing.adding}
                    error={error}
                    editLocation={editLocation}
                    editing={processing.editing}
                    remove={removeLocation}
                    removing={processing.removing}
                    handleLocationName={handleLocationNameChange}
                    handlePublicSpots={handleNewLocationPublicSpotCountChange}
                    handleDedicatedSpots={handleNewLocationDedicatedSpotCountChange}
                />}
                <View style={styles.closeButton}>      
                    <GlobalButton text="Close" transparent={true} onPress={closeModal}  />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({ 
    modalBackDrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center'
    }
});

export default AdminPanelModal;
