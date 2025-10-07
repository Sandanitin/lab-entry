export default function Select({ className = '', ...props }) {
  return (
    <select
      className={`w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
      {...props}
    />
  );
}


