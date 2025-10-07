export default function Label({ className = '', children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
      {children}
    </label>
  );
}


