import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '../index';
import { Login_Route } from '../utils/consts';

const ProtectedRoute = observer(() => {
  const { authStore } = useContext(Context);
  
  if (!authStore.isAuth) {
    return <Navigate to={Login_Route} replace />;
  }
  
  return <Outlet />;
});

export default ProtectedRoute;