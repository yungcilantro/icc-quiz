export function Button({ children, ...props }) {
  return (
    <button className="p-2 border rounded bg-blue-600 text-white hover:bg-blue-700" {...props}>
      {children}
    </button>
  );
}
