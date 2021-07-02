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
import FormRole from '../pages/adminPages/roles/FormRole'
import { IRoute } from '../types'
import Logout from '../pages/Logout'

const routes: IRoute[] = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/logout',
        component: Logout,
    },
    {
        path: '/user',
        component: Users,
    },
    {
        path: '/user/tambahuser',
        component: AddUser,
    },
    {
        path: '/user/edituser',
        component: EditUser,
    },
    {
        path: '/products',
        component: Products
    },
    {
        path: '/products/tambah',
        component: AddProduct,
    },
    {
        path: '/products/edit',
        component: EditProduct
    },
    {
        path: '/tanks',
        component: Tanks
    },
    {
        path: '/tanks/tambah',
        component: FormTank
    },
    {
        path: '/tanks/edit',
        component: FormTank,
    },
    {
        path: '/presensi',
        component: Presence,
    },
    {
        path: '/pompa',
        component: Pumps,
    },
    {
        path: '/pompa/tambah',
        component: FormPump
    },
    {
        path: '/pompa/edit',
        component: FormPump
    },
    {
        path: '/permissions',
        component: Permissions,
    },
    {
        path: '/permissions/tambah',
        component: FormPermission,
    },
    {
        path: '/permissions/edit',
        component: FormPermission,
    },
    {
        path: '/roles',
        component: RolesPage,
    },
    {
        path: '/roles/tambah',
        component: FormRole,
    },
    {
        path: '/roles/edit',
        component: FormRole,
    }
]

export default routes