export function Card({ className = '', children }) {
  return <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>;
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-4 py-3 border-b ${className}`}>{children}</div>;
}

export function CardContent({ className = '', children }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}


