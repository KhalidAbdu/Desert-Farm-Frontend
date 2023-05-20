import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Rating from '../components/Rating';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCUESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductPage() {
  const { slug } = useParams();
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(
          `http://localhost:5005/api/products/slug/${slug}`
        );
        dispatch({ type: 'FETCH_SUCCUESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, [slug]);
  return loading ? (
    <div>Loading ...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description : {product.decription}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}></Col>
      </Row>
    </div>
  );
}
export default ProductPage;
