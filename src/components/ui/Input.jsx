export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
      {...props}
    />
  );
}


