export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`p-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
