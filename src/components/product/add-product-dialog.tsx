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
  name: z.string().min(1, { message: "Product name is required." }),
  unitsSold: z.coerce.number().int().nonnegative({ message: "Units sold must be a non-negative integer." }),
  revenue: z.coerce.number().nonnegative({ message: "Revenue must be a non-negative number." }),
});

type FormData = z.infer<typeof formSchema>;

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (productData: Omit<Product, 'id' | 'salesData'> & { salesData: Omit<Product['salesData'], ''>}) => void;
  triggerButton?: React.ReactNode; // Optional trigger button prop
}

export function AddProductDialog({ open, onOpenChange, onAddProduct, triggerButton }: AddProductDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      unitsSold: 0,
      revenue: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    onAddProduct({
      name: data.name,
      salesData: {
        unitsSold: data.unitsSold,
        revenue: data.revenue,
      },
    });
    form.reset(); // Reset form after submission
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details for the new product. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                 <Button type="submit">Save Product</Button>
             </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
