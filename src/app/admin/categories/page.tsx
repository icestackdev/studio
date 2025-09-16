
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, Edit, Save, X } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { addCategory, deleteCategory, getCategories, updateCategory } from '@/app/actions/category';
import type { Category } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageCategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
    setIsLoading(false);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Category name cannot be empty.',
        });
        return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategory.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Category already exists.',
        });
        return;
    }

    try {
        await addCategory(newCategory);
        setNewCategory('');
        toast({
            title: 'Category Added',
            description: `"${newCategory}" has been added.`,
        });
        fetchCategories();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error adding category.',
        });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      toast({
          title: 'Category Deleted',
          description: `"${category.name}" has been deleted.`,
      });
      fetchCategories();
    } catch (error) {
       toast({
            variant: 'destructive',
            title: 'Error deleting category.',
            description: 'Make sure no products are using this category.',
        });
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setEditedName(category.name);
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    if (editedName.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Category name cannot be empty.',
        });
        return;
    }
    if (categories.some(c => c.name.toLowerCase() === editedName.toLowerCase() && c.id !== editingCategory.id)) {
        toast({
            variant: 'destructive',
            title: 'Category already exists.',
        });
        return;
    }

    try {
        await updateCategory(editingCategory.id, editedName);
        toast({
            title: 'Category Updated',
            description: `"${editingCategory.name}" has been changed to "${editedName}".`
        });
        handleCancelEdit();
        fetchCategories();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error updating category.',
        });
    }
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
        <h1 className="text-lg font-bold">Manage Categories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm">Category Name</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., T-Shirts"
                className="text-sm"
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories found.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id} className="flex items-center justify-between p-2 border rounded-md min-h-[48px]">
                  {editingCategory?.id === category.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input 
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-sm h-8"
                      />
                       <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                       <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm">{category.name}</span>
                      <div className="flex items-center">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStartEdit(category)}>
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
                                This action cannot be undone. This will permanently delete the category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
