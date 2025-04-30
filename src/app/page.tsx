import { getProducts } from '@/services/product-api';
import { ProductTable } from '@/components/product/product-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/shared/header';

export default async function Home() {
  // Fetch initial products on the server
  const initialProducts = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
       <Header title="ProductVerse" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>Manage your products here. Add, edit, or view product details.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductTable initialProducts={initialProducts} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
