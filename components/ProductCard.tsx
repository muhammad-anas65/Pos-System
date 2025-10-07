import React from 'react';
import { Product, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currency: Currency;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, currency }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => !isOutOfStock && onAddToCart(product)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative ${
        isOutOfStock
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer transform hover:-translate-y-1 transition-transform duration-200'
      }`}
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
      {isOutOfStock && (
        <div className="absolute top-0 left-0 w-full h-32 bg-black bg-opacity-40 flex items-center justify-center">
          <span className="text-white font-bold text-sm">Out of Stock</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
            <p className="text-gray-600 dark:text-gray-300 text-xs">{formatCurrency(product.price, currency)}</p>
            <p className={`text-xs font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;