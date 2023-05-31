import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';
import Message from '../components/Message';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_API_URL}/api/products/${item._id}`
    );
    if (data.countInTock < quantity) {
      window.alert('Product will be available soon');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const handleRemove = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Your Cart</title>
      </Helmet>
      <h1>Your Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message>
              Sorry, Empty Cart. <Link to="/">Start Shopping</Link>
            </Message>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroupItem key={item._id}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.image}
                        className="img-fluid rounded img-thumbnail"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant="light"
                        disabled={item.quantity === item.countInTock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => handleRemove(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>{' '}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroupItem>
                <ListGroupItem>
                  <div className="d-grid">
                    <Button
                      onClick={checkoutHandler}
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;
