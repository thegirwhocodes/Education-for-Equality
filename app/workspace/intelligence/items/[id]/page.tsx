import ItemWhy from '../../ItemWhy';

export const dynamic = 'force-dynamic';

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemWhy id={id} />;
}
