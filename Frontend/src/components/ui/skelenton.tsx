// CardSkeleton.tsx
export function CardSkeleton() {
  return (
    <div className="break-inside-avoid mb-4">
      <div className="rounded-lg overflow-hidden bg-gray-900 border border-gray-700 animate-pulse">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-700 rounded-full" />
            <div className="w-32 h-4 bg-gray-700 rounded" />
          </div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-gray-700 rounded-full" />
            <div className="w-6 h-6 bg-gray-700 rounded-full" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
