
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartProvider';
import { ProductCard } from '@/components/product-card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManageProductsPage() {
  const router = useRouter();
  const { state } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState(state.products);

  const handleAddProduct = (data: any & { imageUrls?: string[] }) => {
    const newProductId = `${productList.length + 1}`;
    let newImages = [];
    if(data.imageUrls && data.imageUrls.length > 0) {
        newImages = data.imageUrls.map((imageUrl: string, index: number) => {
            const newImageId = `product-${newProductId}-${index + 1}`;
            // This is a temporary solution for local state.
            // In a real app, you would upload this to a storage service.
            PlaceHolderImages.push({
                id: newImageId,
                description: data.name,
                imageUrl: imageUrl,
                imageHint: data.name.toLowerCase().split(' ').slice(0,2).join(' '),
            });
            return { id: newImageId, hint: data.name.toLowerCase() };
        });
    }

    const newProduct: Product = {
      id: newProductId,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      sizes: data.sizes,
      images: newImages,
    };
    setProductList([newProduct, ...productList]);
    setIsAdding(false);
  };
  
  const handleEditProduct = (data: any & { imageUrls?: string[] }) => {
    if (!editingProduct) return;

    let newImages = [];
    if(data.imageUrls && data.imageUrls.length > 0) {
        newImages = data.imageUrls.map((imageUrl: string, index: number) => {
            const newImageId = `product-${editingProduct.id}-${index + 1}`;
            PlaceHolderImages.push({
                id: newImageId,
                description: data.name,
                imageUrl: imageUrl,
                imageHint: data.name.toLowerCase().split(' ').slice(0,2).join(' '),
            });
            return { id: newImageId, hint: data.name.toLowerCase() };
        });
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      sizes: data.sizes,
      images: newImages.length > 0 ? newImages : editingProduct.images,
    };
    setProductList(productList.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  }

  const handleDeleteProduct = (productId: string) => {
    setProductList(productList.filter(p => p.id !== productId));
  };
  
  const handleStartEdit = (product: Product) => {
    const sizesString = Array.isArray(product.sizes) ? product.sizes.join(', ') : '';
    setEditingProduct({...product, sizes: sizesString as any});
  }

  const formInProgress = isAdding || editingProduct !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <Button 
            variant="ghost" 
            className="rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm h-auto"
            onClick={() => {
              if (formInProgress) {
                setIsAdding(false);
                setEditingProduct(null);
              } else {
                router.back();
              }
            }}
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-1">{formInProgress ? 'Back' : 'Back'}</span>
        </Button>
        <h1 className="text-lg font-bold">Manage Products</h1>
      </div>

      {isAdding ? (
        <ProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : editingProduct ? (
         <ProductForm 
          onSubmit={handleEditProduct} 
          onCancel={() => setEditingProduct(null)}
          initialData={editingProduct}
        />
      ) : (
        <>
          <Button onClick={() => setIsAdding(true)}>Add New Product</Button>
          <div className="grid grid-cols-2 gap-4">
            {productList.map(product => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStartEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
