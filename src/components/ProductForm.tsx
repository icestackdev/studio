
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/contexts/CartProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  category: z.string().min(1, { message: "Please select a category." }),
  sizes: z.string().min(1, { message: "Please enter at least one size, comma-separated." }),
  image1: z.any().optional(),
  image2: z.any().optional(),
  image3: z.any().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues & { imageUrls?: string[] }) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormValues>;
}

export function ProductForm({ onSubmit, onCancel, initialData }: ProductFormProps) {
  const { state } = useCart();
  const { categories } = state;
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      category: '',
      sizes: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = null;
      setImagePreviews(newPreviews);
    }
  };
  
  const handleSubmit = (data: ProductFormValues) => {
    onSubmit({
        ...data,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(s => s),
        imageUrls: imagePreviews.filter((url): url is string => url !== null),
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer T-Shirt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the product." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 29.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sizes</FormLabel>
              <FormControl>
                <Input placeholder="S, M, L, XL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
            <FormLabel>Product Images</FormLabel>
            {[...Array(3)].map((_, index) => (
                <FormField
                    key={index}
                    control={form.control}
                    name={`image${index + 1}` as 'image1' | 'image2' | 'image3'}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Image {index + 1}</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </div>

        <div className="flex gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
                preview && (
                    <div key={index} className="mt-2">
                        <FormLabel className="text-xs">Preview {index + 1}</FormLabel>
                        <div className="mt-2 w-24 h-24 relative">
                            <Image src={preview} alt={`Image preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                        </div>
                    </div>
                )
            ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
}
