export const SkeletonRow = () => (
  <tr>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-8 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-24 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="flex items-center justify-center">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-4 ml-1 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-12 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-8 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);
