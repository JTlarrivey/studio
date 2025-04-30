"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/services/product-api";

// Define the Zod schema for the form validation
const formSchema = z.object({
  id: z.string(), // Keep ID for reference, but make it readonly
  name: z.string().min(1, { message: "Product name is required." }),
  unitsSold: z.coerce.number().int().nonnegative({ message: "Units sold must be a non-negative integer." }),
  revenue: z.coerce.number().nonnegative({ message: "Revenue must be a non-negative number." }),
});

type FormData = z.infer<typeof formSchema>;

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEditProduct: (updatedProduct: Product) => void;
  triggerButton?: React.ReactNode; // Optional trigger button prop
}

export function EditProductDialog({ open, onOpenChange, product, onEditProduct, triggerButton }: EditProductDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // Default values will be set by useEffect when product changes
  });

   // Update form default values when the product prop changes or dialog opens
   React.useEffect(() => {
    if (product && open) {
      form.reset({
        id: product.id,
        name: product.name,
        unitsSold: product.salesData.unitsSold,
        revenue: product.salesData.revenue,
      });
    } else if (!open) {
         // Optionally reset form fully when dialog closes if desired
         form.reset({ id: '', name: '', unitsSold: 0, revenue: 0 });
    }
  }, [product, open, form]);


  const onSubmit = (data: FormData) => {
    if (!product) return; // Should not happen if dialog is open with a product

    const updatedProduct: Product = {
      id: product.id, // Use original ID
      name: data.name,
      salesData: {
        unitsSold: data.unitsSold,
        revenue: data.revenue,
      },
    };
    onEditProduct(updatedProduct);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
         {product ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                {/* ID Field (Readonly) */}
               <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly className="bg-muted cursor-not-allowed" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="unitsSold"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Units Sold</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Enter units sold" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Revenue ($)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter revenue" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
          </Form>
        ) : (
            // Optional: Show a loading or error state if product is null when dialog is open
            <p>Loading product data...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
