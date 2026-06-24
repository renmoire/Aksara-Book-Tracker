export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-xl p-3">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="w-full h-56 object-cover rounded-lg"
      />

      <h3 className="mt-2 font-semibold">
        {book.title}
      </h3>

      <p className="text-sm text-gray-500">
        {book.author}
      </p>
    </div>
  );
}