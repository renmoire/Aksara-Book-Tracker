import BookCard from "./BookCard";

export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}