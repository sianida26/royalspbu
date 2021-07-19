import Home from '../pages/operatorPages/Home'
import Absen from '../pages/operatorPages/Absen'
import Logout from '../pages/Logout'
import Laporan from '../pages/operatorPages/laporan'
import { IRoute } from '../types'

const routes: IRoute[] = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/absen',
        component: Absen
    },
    {
        path: '/logout',
        component: Logout,
    },
    {
        path: '/laporan',
        component: Laporan,
    }
]

export default routes