import BookDetail from '@/src/components/book/bookDetail'

export default async function BookDetailPage({ params }) {
  const { id } = await params
  return <BookDetail bookId={id} />
}