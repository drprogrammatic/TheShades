import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import { getVisibleProductBySlug } from '@/lib/catalog';

export default async function ProductDetailsPage({ searchParams }) {
  const slug = searchParams.slug || '';
  const category = searchParams.category || '';
  const product = slug ? await getVisibleProductBySlug(slug) : null;

  return <ProductDetailsClient initialProduct={product} slug={slug} category={category} />;
}
