import { Menu } from 'react-admin';
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';
import { Link } from 'react-router-dom';

export const AdminMenu = () => (
    <Menu>
        <Menu.Item
            to="/admin/"
            primaryText="Home"
            leftIcon={<HomeIcon />}
            component={Link}
        />
        <Menu.ResourceItem name="users" />
        <Menu.ResourceItem name="posts" />
        <Menu.ResourceItem name="report" />
        <Menu.ResourceItem name="event" />
        <Menu.ResourceItem name="magazine" />
    </Menu>
);
