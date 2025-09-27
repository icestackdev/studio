
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef } from 'react';
import Image from 'next/image';
import type { Category } from '@prisma/client';
import { Product } from '@/lib/types';
import { X, ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  sizes: z.string().min(1, { message: "Please enter at least one size, comma-separated." }),
  images: z.any().optional().describe("Image files for upload"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: Partial<Product>;
  categories: Category[];
}

const MAX_IMAGES = 2;

export function ProductForm({ onSubmit, onCancel, initialData, categories }: ProductFormProps) {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images?.map(i => i.url) || []);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images?.map(i => i.url) || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        sizes: Array.isArray(initialData.sizes) ? initialData.sizes.join(', ') : '',
    } : {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      sizes: '',
      images: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = imagePreviews.length + files.length;

      if (totalImages > MAX_IMAGES) {
        toast({
          variant: 'destructive',
          title: `You can only upload a maximum of ${MAX_IMAGES} images.`,
        });
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        return;
      }
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setNewImageFiles(prev => [...prev, ...files]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const removedPreview = imagePreviews[index];
    
    if (index < existingImages.length) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      const newFileIndex = index - existingImages.length;
      const newFiles = [...newImageFiles];
      newFiles.splice(newFileIndex, 1);
      setNewImageFiles(newFiles);
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(removedPreview);
  }

  const handleSubmit = (data: ProductFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'images' && value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });

    newImageFiles.forEach(file => {
        formData.append('images', file);
    });
    
    if (initialData) {
        formData.append('existingImages', existingImages.join(','));
    }

    onSubmit(formData);
  };
  
  const imageCount = imagePreviews.length;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                 <div className="grid grid-cols-2 gap-4">
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
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
            </CardContent>
        </Card>
       
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Sizing & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                
                <FormItem>
                <FormLabel>Product Images (up to {MAX_IMAGES})</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={imageCount >= MAX_IMAGES}
                        />
                    </FormControl>
                    <FormMessage />
                    <div className="grid grid-cols-3 gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={preview} className="relative aspect-square">
                                <Image src={preview} alt={`Image preview ${index + 1}`} fill objectFit="cover" className="rounded-md" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {imageCount < MAX_IMAGES && (
                            <Button 
                                type="button"
                                variant="outline" 
                                className="aspect-square flex-col gap-1 h-full w-full"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Add Image</span>
                            </Button>
                        )}
                    </div>
                </FormItem>
            </CardContent>
        </Card>

        <Card>
            <CardFooter className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
