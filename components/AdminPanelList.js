import React from 'react';
import { FlatList } from 'react-native';
import AdminPanelListItem from './AdminPanelListItem';


const AdminPanelList = ({ data, remove, removing, error, edit }) => (
    <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AdminPanelListItem item={ item } remove={ remove } removing={ removing } error={ error } edit={ edit } />}
    />
);

export default AdminPanelList;
