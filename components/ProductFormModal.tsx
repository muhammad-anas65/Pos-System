import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
  product: Product | null;
  categories: Category[];
  isSaving: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product, categories, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: categories.find(c => c !== 'All') || '',
    price: '',
    stock: '',
    imageUrl: '',
  });
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
  
  useEffect(() => {
    const firstCategory = categories.find(c => c !== 'All') || '';
    if (product) {
      setFormData({
        name: product.name,
        category: product.category as Exclude<Category, 'All'>,
        price: String(product.price),
        stock: String(product.stock),
        imageUrl: product.imageUrl,
      });
       // Determine if the imageUrl is a data URL (upload) or a web URL
       setImageInputType(product.imageUrl.startsWith('data:image/') ? 'upload' : 'url');
    } else {
      setFormData({
        name: '',
        category: firstCategory,
        price: '',
        stock: '',
        imageUrl: '',
      });
      setImageInputType('url');
    }
  }, [product, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        imageUrl: formData.imageUrl
    };

    if (product) {
        onSave({ ...productData, id: product.id });
    } else {
        onSave(productData);
    }
  };

  if (!isOpen) return null;

  const availableCategories = categories.filter(c => c !== 'All');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600">
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
            
            {/* Image Input Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative inline-flex items-center space-x-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                           <input id="image-url" name="image-type" type="radio" value="url" checked={imageInputType === 'url'} onChange={() => setImageInputType('url')} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                           <label htmlFor="image-url" className="text-sm">URL</label>
                        </div>
                         <div className="flex items-center gap-2">
                           <input id="image-upload" name="image-type" type="radio" value="upload" checked={imageInputType === 'upload'} onChange={() => setImageInputType('upload')} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                           <label htmlFor="image-upload" className="text-sm">Upload</label>
                        </div>
                    </div>
                    {imageInputType === 'url' ? (
                         <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.png" className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700" />
                    ) : (
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-r-md file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary dark:file:bg-primary-dark/20 dark:file:text-primary-light hover:file:bg-primary/20 dark:hover:file:bg-primary-dark/40" />
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Provide an image URL or upload a file. If left blank, an AI-generated image will be created on save.
                </p>
                {formData.imageUrl && (
                    <div className="mt-4">
                        <img src={formData.imageUrl} alt="Product Preview" className="h-24 w-24 rounded-md object-cover bg-gray-100 dark:bg-gray-700" />
                    </div>
                )}
            </div>

          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg flex justify-end space-x-3 mt-auto">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-wait"
                disabled={isSaving}
            >
                {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
