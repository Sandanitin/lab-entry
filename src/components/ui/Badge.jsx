export default function Badge({ className = '', variant = 'default', children }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  return <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded ${variants[variant]} ${className}`}>{children}</span>;
}


