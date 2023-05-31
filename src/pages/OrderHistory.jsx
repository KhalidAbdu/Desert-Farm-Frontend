import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import { Button } from 'react-bootstrap';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchNumOfOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/api/orders/list`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchNumOfOrders();
  }, [userInfo, navigate]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((oneOrder) => (
              <tr key={oneOrder._id}>
                <td>{oneOrder._id}</td>
                <td>{oneOrder.createdAt}</td>
                <td>{oneOrder.totalPrice}</td>
                <td>{oneOrder.isPaid ? oneOrder.paidAt : 'NO'}</td>
                <td>{oneOrder.isDelivered ? oneOrder.deliveredAt : 'NO'}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${oneOrder._id}`);
                    }}
                  >
                    Show Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;
