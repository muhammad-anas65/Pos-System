
import React from 'react';
import { Product, Currency } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  currency: Currency;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, currency }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} currency={currency} />
      ))}
    </div>
  );
};

export default ProductGrid;