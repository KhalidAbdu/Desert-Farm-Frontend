import { useParams } from 'react-router-dom';

function ProductPage() {
  const { slug } = useParams();
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  );
}
export default ProductPage;
