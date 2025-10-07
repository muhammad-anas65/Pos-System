import React, { useState } from 'react';
import { Product, Currency } from '../types';
import ProductFormModal from './ProductFormModal';
import { PencilIcon, TrashIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
  currency: Currency;
  taxRate: number;
  onTaxRateChange: (newRate: number) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  currency,
  taxRate,
  onTaxRateChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenModalForNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    handleCloseModal();
  };
  
  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        onDeleteProduct(productId);
    }
  }
  
  const handleTaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentage = parseFloat(value);
    if (!isNaN(percentage) && percentage >= 0) {
        onTaxRateChange(percentage / 100);
    } else if (value === '') {
        onTaxRateChange(0);
    }
  };

  return (
    <main className="p-6" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product Management</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                 <div>
                    <label htmlFor="tax-rate-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Tax Rate (%)</label>
                    <input
                        type="number"
                        id="tax-rate-input"
                        value={(taxRate * 100).toFixed(2)}
                        onChange={handleTaxInputChange}
                        className="w-full sm:w-32 mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 8"
                    />
                 </div>
                <button
                    onClick={handleOpenModalForNew}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 self-end sm:self-center"
                >
                    Add New Product
                </button>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Image</th>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Stock</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4">
                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {product.name}
                            </th>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">{formatCurrency(product.price, currency)}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-4">
                                    <button onClick={() => handleOpenModalForEdit(product)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <ProductFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
            product={editingProduct}
        />
    </main>
  );
};

export default ProductManagement;