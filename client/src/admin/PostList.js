import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, TopToolbar, FilterButton, SearchInput, CreateButton,  ShowButton, DateField, ChipField} from 'react-admin';
import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';
import { DateInput, NumberInput, ReferenceInput } from 'react-admin';
import { Create } from 'react-admin';
import BooleanField from './BooleanField'; 
import { FilterSidebar, ListActions } from './FilterSidebar';
import ToggleButton from './ToggleButton';
import { RichTextInput } from 'ra-input-rich-text';

const postFilters = [
    <SearchInput source="q" />,
    <TextInput label="Email" source="email" defaultValue="" />,
    <TextInput label="Category" source="category" defaultValue="" />,
    <TextInput label="NickName" source="nickname" defaultValue="" />,
    <TextInput label="Title" source="title" defaultValue="" />,
    <TextInput label="WriteDay" source="writeday" defaultValue="" />,
    <BooleanInput label ="Pinned" source="pinned" defaultValue={true}/>,
    <BooleanInput label ="Hidden" source="hidden" defaultValue={true}/>,
];

export const PostList = (props) => (
    <List {...props} debounce={1000} actions={<ListActions/>} filters={postFilters} aside={<FilterSidebar/>}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="author_id" />
            <TextField source="nickname" />
            <ChipField source="category" />
            <TextField source="title" />
            <TextField source="writeday" />
            <BooleanField source="pinned" />
            <BooleanField source="hidden" />
         {/*<ToggleButton field="pinned" />*/}
         {/*<ToggleButton field="hidden" />*/}
            <ShowButton/>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);


export const PostEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nickname" />
            <NumberInput source="category" />
            <TextInput source="title" />
            <RichTextInput source="content" />
            <TextInput source="photoes" />
            <TextInput source="media" />
            <TextInput source="author_id"/>
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="author_id" />
            <TextInput source="nickname" />
            <TextInput source="category" />
            <TextInput source="title" />
            <RichTextInput source="content" />
            <TextInput source="writeday" />
            <BooleanInput source="pinned" label="Pinned" />
            <BooleanInput source="hidden" label="Hidden" />
        </SimpleForm>
    </Create>
);