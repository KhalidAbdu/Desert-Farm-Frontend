import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { getError } from '../utils';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
function ListProducts() {
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_API_URL
          }/api/products/admin?page=${page}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, page, successDelete]);
  const createHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/api/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('NEW PRODUCT CREATED SUCCESSFULLY');
      dispatch({ type: 'CREATE_SUCCESS' });
      navigate(`/admin/product/${data.product._id}`);
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  const deleteHandler = async (product) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/api/products/${product._id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Product Deleted');
      dispatch({ type: 'DELETE_SUCCESS' });
    } catch (error) {
      toast.error(getError);
      dispatch({ type: 'DELETE_FAIL' });
    }
  };
  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end"></Col>
        <div>
          <Button type="button" onClick={createHandler}>
            Create Product
          </Button>
        </div>
      </Row>
      {loadingCreate && <Loading></Loading>}
      {loadingDelete && <Loading></Loading>}
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>BRAND</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListProducts;
