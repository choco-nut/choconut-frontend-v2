export const CartSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 animate-pulse">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-10 w-64 bg-amber-200 rounded-lg mb-3"></div>
        <div className="h-5 w-32 bg-amber-100 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items Column Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl flex items-center justify-between border border-amber-100">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-20 h-20 bg-amber-100 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-amber-200 rounded"></div>
                  <div className="h-4 w-20 bg-amber-100 rounded"></div>
                </div>
              </div>
              <div className="h-10 w-24 bg-amber-50 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Summary Card Skeleton */}
        <div className="bg-white p-6 rounded-2xl h-80 border border-amber-100">
          <div className="h-6 w-32 bg-amber-200 mb-6 rounded"></div>
          <div className="space-y-4">
            <div className="flex justify-between"><div className="h-4 w-20 bg-amber-100 rounded"></div><div className="h-4 w-12 bg-amber-100 rounded"></div></div>
            <div className="flex justify-between"><div className="h-4 w-20 bg-amber-100 rounded"></div><div className="h-4 w-12 bg-amber-100 rounded"></div></div>
            <div className="h-px bg-amber-100 my-4"></div>
            <div className="h-12 bg-amber-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);