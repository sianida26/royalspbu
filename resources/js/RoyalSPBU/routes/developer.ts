import Permissions from '../pages/adminPages/permissions/Permissions'
import FormPermission from '../pages/adminPages/permissions/FormPermission'

import RolesPage from '../pages/adminPages/roles/Roles'
import FormRole from '../pages/adminPages/roles/FormRole'

import { IRoute } from '../types'

import adminRoutes from './admin'

const routes: IRoute[] = [
    ...adminRoutes,
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