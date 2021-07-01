import React from 'react'
import AdminConfigProvider from '../providers/AdminConfigProvider'
import { withRouter, Redirect, Route, Switch } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

import PrivateRoute from '../components/PrivateRoute'

import Home from '../pages/adminPages/Home'
import Users from '../pages/adminPages/users/Users'
import AddUser from '../pages/adminPages/users/AddUser'
import EditUser from '../pages/adminPages/users/EditUser'

import Permissions from '../pages/adminPages/permissions/Permissions'
import FormPermission from '../pages/adminPages/permissions/FormPermission'

import RolesPage from '../pages/adminPages/roles/Roles'

import Products from '../pages/adminPages/products/Products'
import AddProduct from '../pages/adminPages/products/AddProduct'
import EditProduct from '../pages/adminPages/products/EditProduct'

import Tanks from '../pages/adminPages/tanks/Tanks'
import FormTank from '../pages/adminPages/tanks/FormTank'

import Pumps from '../pages/adminPages/pumps/Pumps'
import FormPump from '../pages/adminPages/pumps/FormPump'

import Presence from '../pages/adminPages/presence/Presence'

import { Roles } from '../types'
import FormRole from '../pages/adminPages/roles/FormRole'

const AdminRoutes = () => {

    const { auth } = useAuth()

    const routes = [
        {
            path: '/',
            exact: true,
            component: Home,
        },
        {
            path: '/user',
            exact: true,
            component: Users,
        },
        {
            path: '/user/tambahuser',
            exact: true,
            component: AddUser,
        },
        {
            path: '/user/edituser',
            exact: true,
            component: EditUser,
        },
        {
            path: '/products',
            exact: true,
            component: Products
        },
        {
            path: '/products/tambah',
            exact: true,
            component: AddProduct,
        },
        {
            path: '/products/edit',
            exact: true,
            component: EditProduct
        },
        {
            path: '/tanks',
            exact: true,
            component: Tanks
        },
        {
            path: '/tanks/tambah',
            exact: true,
            component: FormTank
        },
        {
            path: '/tanks/edit',
            exact: true,
            component: FormTank,
        },
        {
            path: '/presensi',
            exact: true,
            component: Presence,
        },
        {
            path: '/pompa',
            exact: true,
            component: Pumps,
        },
        {
            path: '/pompa/tambah',
            exact: true,
            component: FormPump
        },
        {
            path: '/pompa/edit',
            exact: true,
            component: FormPump
        },
        {
            path: '/permissions',
            exact: true,
            component: Permissions,
        },
        {
            path: '/permissions/tambah',
            exact: true,
            component: FormPermission,
        },
        {
            path: '/permissions/edit',
            exact: true,
            component: FormPermission,
        },
        {
            path: '/roles',
            exact: true,
            component: RolesPage,
        },
        {
            path: '/roles/tambah',
            exact: true,
            component: FormRole,
        },
        {
            path: '/roles/edit',
            exact: true,
            component: FormRole,
        }
    ]

    // todo: desain page not found
    const NotFoundRoute = () => {
        return (
            <div>Page Not Found</div>
        )
    }

    return auth.role !== Roles.ADMIN ? <Redirect to={{pathname: "/login", state: {from: location}}} /> : (
        <AdminConfigProvider>
            <Switch>
                {
                    routes.map(route => <Route path={route.path} exact={route.exact} component={route.component} />)
                }
                <Route component={NotFoundRoute} />
            </Switch>
        </AdminConfigProvider>
    )
}

export default withRouter(AdminRoutes)