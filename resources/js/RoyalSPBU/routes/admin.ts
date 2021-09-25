import Home from '../pages/adminPages/Home'
import Users from '../pages/adminPages/users/Users'
import AddUser from '../pages/adminPages/users/AddUser'
import EditUser from '../pages/adminPages/users/EditUser'

import Permissions from '../pages/adminPages/permissions/Permissions'
import FormPermission from '../pages/adminPages/permissions/FormPermission'

import RolesPage from '../pages/adminPages/roles/Roles'

import Products from '../pages/adminPages/products/Products'

import Tanks from '../pages/adminPages/tanks/Tanks'
import FormTank from '../pages/adminPages/tanks/FormTank'

import Pumps from '../pages/adminPages/pumps/Pumps'
import FormPump from '../pages/adminPages/pumps/FormPump'

import Presence from '../pages/adminPages/presence/Presence'
import FormRole from '../pages/adminPages/roles/FormRole'
import { IRoute } from '../types'
import Logout from '../pages/Logout'

import Reports from '../pages/adminPages/reports/Reports'
import PompaHarian from '../pages/adminPages/reports/PompaHarian/PompaHarian'
import DetailPompaHarian from '../pages/adminPages/reports/PompaHarian/Detail'

import ListPenerimaan from '../pages/adminPages/penerimaan/ListPenerimaan'
import CreatePenerimaan from '../pages/adminPages/penerimaan/FormCreatePenerimaan'
import KonfirmasiPenerimaan from '../pages/adminPages/penerimaan/KonfirmasiPenerimaan'
import DetailPenerimaan from '../pages/adminPages/penerimaan/DetailPenerimaan'

import TotalisatorHarian from '../pages/adminPages/reports/TotalisatorHarian/TotalisatorHarian'
import FormTotalisatorHarian from '../pages/adminPages/reports/TotalisatorHarian/FormLaporan'

import PersediaanBBM from '../pages/adminPages/reports/PersediaanBBM/PersediaanBBM'
import FormPersediaanBBM from '../pages/adminPages/reports/PersediaanBBM/FormPersediaanBBM'

import MonthlyReports from '../pages/adminPages/monthlyReports/MonthlyReports'
import Profile from '../pages/adminPages/profile/Profile'

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
        path: '/profil',
        component: Profile,
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
    },
    {
        path: '/laporan',
        component: Reports,
    },
    {
        path: '/laporan/pompa-harian',
        component: PompaHarian,
    },
    {
        path: '/laporan/pompa-harian/detail',
        component: DetailPompaHarian,
    },
    {
        path: '/laporan/totalisator-harian',
        component: TotalisatorHarian,
    },
    {
        path: '/laporan/totalisator-harian/buat',
        component: FormTotalisatorHarian,
    },
    {
        path: '/laporan/totalisator-harian/edit',
        component: FormTotalisatorHarian,
    },
    {
        path: '/laporan/persediaan',
        component: PersediaanBBM,
    },
    {
        path: '/laporan/persediaan/detail',
        component: FormPersediaanBBM,
    },
    {
        path: '/laporan-bulanan',
        component: MonthlyReports,
    },
    {
        path: '/penerimaan',
        component: ListPenerimaan,
    },
    {
        path: '/penerimaan/minta',
        component: CreatePenerimaan
    },
    {
        path: '/penerimaan/minta/edit',
        component: CreatePenerimaan,
    },
    {
        path: '/penerimaan/konfirmasi',
        component: KonfirmasiPenerimaan,
    },
    {
        path: '/penerimaan/detail',
        component: DetailPenerimaan,
    },
]

export default routes