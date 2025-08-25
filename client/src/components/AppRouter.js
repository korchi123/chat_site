import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRouter, authRouter } from '../routes/routes'; // путь к вашему файлу
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../index.js';
import { Posts_Route } from '../utils/consts.js';
import ProtectedRoute from '../routes/ProtectedRoute.js';


const AppRouter = observer(() => {
  const {authStore}=useContext(Context)

  console.log(authStore)
  return (
   
    <Routes>
      {publicRouter.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route element={<ProtectedRoute />}>
        {authRouter.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to={Posts_Route} replace />} />

    </Routes>

  );
}
)

export default AppRouter;