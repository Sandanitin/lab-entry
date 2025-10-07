export default function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  const variants = {
    default: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  const cn = `${variants[variant]} ${sizes[size]} rounded transition ${className}`;
  return <button className={cn} {...props} />;
}


