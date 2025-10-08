import React, { useState } from 'react';
import { Product, Currency, Category } from '../types';
import ProductFormModal from './ProductFormModal';
import { PencilIcon, TrashIcon } from './icons';
import { formatCurrency } from '../utils/formatters';

interface ProductManagementProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (newProduct: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onAddCategory: (newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
  currency: Currency;
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  currency,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    setIsSaving(true);
    try {
        if ('id' in productData) {
            onUpdateProduct(productData);
        } else {
            await onAddProduct(productData);
        }
    } catch (error) {
        console.error("Failed to save product:", error);
        alert("There was an error saving the product. Please check the console for details.");
    } finally {
        setIsSaving(false);
        handleCloseModal();
    }
  };
  
  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        onDeleteProduct(productId);
    }
  }

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
        onAddCategory(newCategoryName.trim());
        setNewCategoryName('');
    }
  };

  return (
    <main className="p-4 sm:p-6" style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Product & Category Management</h1>
            <button
                onClick={handleOpenModalForNew}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200 self-end sm:self-center"
            >
                Add New Product
            </button>
        </div>

        {/* Category Management Section */}
        <div className="mb-6 p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Category Management</h2>
            <form onSubmit={handleAddCategorySubmit} className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
                    Add Category
                </button>
            </form>
            <div className="flex flex-wrap gap-2">
                {categories.filter(c => c !== 'All').map(cat => (
                    <div key={cat} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm">
                        <span>{cat}</span>
                        <button onClick={() => onDeleteCategory(cat)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm text-left text-gray-500 dark:text-gray-400">
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
            categories={categories}
            isSaving={isSaving}
        />
    </main>
  );
};

export default ProductManagement;
