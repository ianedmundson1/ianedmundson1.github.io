import { Outlet } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import ConnectLinks from '../ConnectLinks/ConnectLinks';

const Layout = () => (
  <>
    <Navigation />
    <Outlet />
    <ConnectLinks />
  </>
);

export default Layout;