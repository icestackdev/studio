
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartProvider';
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

export default function ManageCategoriesPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { categories } = state;
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Category name cannot be empty.',
        });
        return;
    }
    if (categories.includes(newCategory)) {
        toast({
            variant: 'destructive',
            title: 'Category already exists.',
        });
        return;
    }

    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    setNewCategory('');
    toast({
        title: 'Category Added',
        description: `"${newCategory}" has been added.`,
    });
  };

  const handleDeleteCategory = (category: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: category });
    toast({
        title: 'Category Deleted',
        description: `"${category}" has been deleted.`,
    });
  };

  const handleStartEdit = (category: string) => {
    setEditingCategory(category);
    setEditedName(category);
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    if (editedName.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Category name cannot be empty.',
        });
        return;
    }
    if (categories.includes(editedName) && editedName !== editingCategory) {
        toast({
            variant: 'destructive',
            title: 'Category already exists.',
        });
        return;
    }

    dispatch({ type: 'EDIT_CATEGORY', payload: { oldName: editingCategory, newName: editedName } });
    toast({
        title: 'Category Updated',
        description: `"${editingCategory}" has been changed to "${editedName}".`
    });
    handleCancelEdit();
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
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories found.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category} className="flex items-center justify-between p-2 border rounded-md min-h-[48px]">
                  {editingCategory === category ? (
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
                      <span className="text-sm">{category}</span>
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
