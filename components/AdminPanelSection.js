import { Spinner, View, Text } from 'native-base';
import React from 'react';
import AdminPanelList from './AdminPanelList';
import GlobalButton from '../components/GlobalButton';
import SearchInput from './SeacrhInput';
import { ScrollView } from 'react-native';

const AdminPanelSection = (props) => {
    const {
        processing,
        error,
        listData,
        addButtonText,
        addFunction,
        handleSearchTextChange,
        searchInputPlaceHolder,
        removeFunction,
        editLocation,
        switchToLocation,
        currentUser,
    } = props;

    return(
            processing.fetching ?
            <Spinner />
            :
            error.type === 'fetch' ?
            <Text> {error.message} </Text>
            :
            <>
                <GlobalButton 
                    text={addButtonText}
                    onPress={addFunction}
                    bordered={true}
                />
                <SearchInput 
                    placeholder={searchInputPlaceHolder}
                    handleTextChange={handleSearchTextChange}
                />
                <AdminPanelList
                    data={listData}
                    error={error}
                    removing={ processing.removing }
                    remove={ removeFunction }
                    edit={editLocation}
                    switchToLocation={switchToLocation}
                    currentUser={currentUser}
                    switching={processing.switching}
                />
            </>
    );
}

export default AdminPanelSection;
