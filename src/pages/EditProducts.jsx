import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};
function EditProducts() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInTock, setCountInTock] = useState('');
  const [decription, setDecription] = useState('');
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/api/products/${productId}`
        );
        setName(data.name);
        setSlug(data.slug);
        setBrand(data.brand);
        setImage(data.image);
        setCategory(data.category);
        setCountInTock(data.countInTock);
        setDecription(data.decription);
        setPrice(data.price);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [productId]);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          category,
          brand,
          decription,
          countInTock,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product Updated');
      navigate('/admin/products');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/api/upload`,
        bodyFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'UPLOAD_SUCCESS' });

      toast.success('Image uploaded successfully');
      setImage(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <FormGroup className="mb-3" controlId="name">
            <FormLabel>Name</FormLabel>
            <FormControl
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="slug">
            <FormLabel>Slug</FormLabel>
            <FormControl
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="brand">
            <FormLabel>Brand</FormLabel>
            <FormControl
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="price">
            <FormLabel>Price</FormLabel>
            <FormControl
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="countInTock">
            <FormLabel>Count In Stock</FormLabel>
            <FormControl
              value={countInTock}
              onChange={(e) => setCountInTock(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="decription">
            <FormLabel>Description</FormLabel>
            <FormControl
              value={decription}
              onChange={(e) => setDecription(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="category">
            <FormLabel>Category</FormLabel>
            <FormControl
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="image">
            <FormLabel>Image</FormLabel>
            <FormControl
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup className="mb-3" controlId="imageFile">
            <FormLabel>Upload File</FormLabel>
            <FormControl type="file" onChange={uploadFileHandler} />
            {loadingUpload && <Loading></Loading>}
          </FormGroup>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <Loading></Loading>}
          </div>
        </Form>
      )}
    </Container>
  );
}

export default EditProducts;
