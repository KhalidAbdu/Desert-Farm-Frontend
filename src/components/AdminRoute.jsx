import { useContext } from 'react';
import { Store } from '../Store';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}

export default AdminRoute;
