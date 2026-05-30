import ProductDetailsClient from '@/components/products/ProductDetailsClient';
import { getVisibleProductBySlug } from '@/lib/catalog';

export default async function ProductDetailPage({ params }) {
  const product = await getVisibleProductBySlug(params.slug);
  return <ProductDetailsClient initialProduct={product} slug={params.slug} category={params.category} />;
}
