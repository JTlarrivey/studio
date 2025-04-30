"use client";

import * as React from "react";
import type { Product } from "@/services/product-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddProductDialog } from "./add-product-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import {
  ArrowUpDown,
  Edit,
  PlusCircle,
  Trash2,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";


type SortKey = keyof Product | keyof Product["salesData"];
type SortDirection = "asc" | "desc";

interface ProductTableProps {
  initialProducts: Product[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [filter, setFilter] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const { toast } = useToast();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'salesData'> & { salesData: Omit<Product['salesData'], ''>}) => {
    // Mock adding product - in a real app, call addProduct API
    const addedProduct: Product = {
        ...newProduct,
        id: String(Date.now()), // Simple mock ID generation
    };
    setProducts((prev) => [...prev, addedProduct]);
    toast({
      title: "Success",
      description: "Product added successfully.",
      variant: "default",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    // Mock editing product - in a real app, call updateProduct API
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
     toast({
      title: "Success",
      description: "Product updated successfully.",
      variant: "default",
    });
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

   const handleDeleteProduct = (productId: string) => {
    // Mock deleting product - in a real app, call deleteProduct API
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast({
      title: "Success",
      description: "Product deleted successfully.",
       variant: "default", // Or "destructive" if preferred for delete actions
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const filteredProducts = React.useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase()) ||
      product.id.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortKey) {
      filtered = filtered.sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        if (sortKey === 'unitsSold' || sortKey === 'revenue') {
           valA = a.salesData[sortKey];
           valB = b.salesData[sortKey];
        } else {
            valA = a[sortKey as keyof Omit<Product, 'salesData'>];
            valB = b[sortKey as keyof Omit<Product, 'salesData'>];
        }


        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        return 0; // Should not happen with current keys
      });
    }

    return filtered;
  }, [products, filter, sortKey, sortDirection]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-2 h-4 w-4" /> // Replace with specific up/down icons if needed
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" /> // Replace with specific up/down icons if needed
    );
  };


  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter by name or ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddProduct={handleAddProduct}
          triggerButton={
            <Button variant="default">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  ID {renderSortIcon("id")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("unitsSold")}
              >
                 <div className="flex items-center justify-end">
                    Units Sold {renderSortIcon("unitsSold")}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSort("revenue")}
              >
                 <div className="flex items-center justify-end">
                    Revenue {renderSortIcon("revenue")}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">{product.salesData.unitsSold.toLocaleString('en-US')}</TableCell>
                  <TableCell className="text-right">${product.salesData.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className="text-right space-x-2">
                     <EditProductDialog
                        open={isEditDialogOpen && editingProduct?.id === product.id}
                        onOpenChange={(open) => {
                            if (!open) {
                                setIsEditDialogOpen(false);
                                setEditingProduct(null);
                            }
                        }}
                        product={editingProduct}
                        onEditProduct={handleEditProduct}
                        triggerButton={
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                        }
                        />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                             </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product
                                "{product.name}".
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Render Edit Dialog outside the table loop if triggered by state */}
       {editingProduct && !isEditDialogOpen && ( // Ensure dialog only renders when explicitly closed if needed, or manage open state differently
         <EditProductDialog
            open={isEditDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                } else {
                     setIsEditDialogOpen(true); // Ensure state consistency if re-opened programmatically
                }
            }}
            product={editingProduct}
            onEditProduct={handleEditProduct}
            // No trigger needed here as it's controlled by state
         />
       )}
    </div>
  );
}
