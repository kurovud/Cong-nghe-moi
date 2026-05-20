import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default function ProductsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  return <ProductsClient initialCategory={category} initialQuery={query} />;
}
