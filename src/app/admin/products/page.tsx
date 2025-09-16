
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
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
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/app/actions/product';
import type { Category } from '@prisma/client';
import { getCategories } from '@/app/actions/category';
import { useToast } from '@/hooks/use-toast';

export default function ManageProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    setProductList(products as Product[]);
    setCategories(categories);
  }

  const handleAddProduct = async (data: FormData) => {
    try {
      await addProduct(data);
      setIsAdding(false);
      fetchData();
      toast({ title: 'Product added successfully' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error adding product' });
    }
  };
  
  const handleEditProduct = async (data: FormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      setEditingProduct(null);
      fetchData();
      toast({ title: 'Product updated successfully' });
    } catch (error) {
       console.error(error);
      toast({ variant: 'destructive', title: 'Error updating product' });
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      fetchData();
      toast({ title: 'Product deleted successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting product' });
    }
  };
  
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
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
            <span className="ml-1">{formInProgress ? 'Cancel' : 'Back'}</span>
        </Button>
        <h1 className="text-lg font-bold">Manage Products</h1>
      </div>

      {isAdding ? (
        <ProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAdding(false)} 
          categories={categories}
        />
      ) : editingProduct ? (
         <ProductForm 
          onSubmit={handleEditProduct} 
          onCancel={() => setEditingProduct(null)}
          initialData={editingProduct}
          categories={categories}
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
