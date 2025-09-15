"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ArrowLeft } from 'lucide-react';

export default function ManageProductsPage() {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [productList, setProductList] = useState(products);

  const handleAddProduct = (data: any) => {
    const newProduct = {
      id: `${productList.length + 1}`,
      ...data,
      images: [], // Placeholder for images
    };
    setProductList([newProduct, ...productList]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <Button 
            variant="ghost" 
            className="rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm h-auto"
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Manage Products</h1>
      </div>

      {isAdding ? (
        <ProductForm 
          onSubmit={handleAddProduct} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <>
          <Button onClick={() => setIsAdding(true)}>Add New Product</Button>
          <div className="grid grid-cols-2 gap-4">
            {productList.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
