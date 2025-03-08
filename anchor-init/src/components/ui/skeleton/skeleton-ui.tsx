export const SkeletonRow1 = () => (
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

export const SkeletonRow2 = () => (
  <tr>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-8 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
    <td className="p-2 text-center border border-gray-300">
      <div className="h-6 w-24 mx-auto bg-gray-200 rounded animate-pulse"></div>
    </td>
  </tr>
);

export function SkeletonFundDetail() {
  return (
    <div>
      <div className="w-dvw pt-12 pb-12 bg-pink-300 animate-pulse">
        <div className="px-8">
          <div className="h-12 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 w-96 bg-gray-300 rounded"></div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded">
              <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
              <div className="h-10 w-48 bg-gray-300 rounded"></div>
            </div>

            <div className="bg-white p-4 rounded">
              <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
              <div className="h-10 w-48 bg-gray-300 rounded"></div>
            </div>

            <div className="bg-white rounded">
              <div className="flex justify-between items-center border-b border-gray-200 p-3">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="flex flex-col items-end">
                  <div className="h-3 w-16 bg-gray-300 rounded mb-1"></div>
                  <div className="h-6 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="flex flex-col items-end">
                  <div className="h-3 w-16 bg-gray-300 rounded mb-1"></div>
                  <div className="h-6 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonFundList() {
  return (
    <div>
      <div
        className="w-dvw pt-12 pb-12 animate-pulse"
        style={{
          backgroundColor: "rgba(123, 217, 56, 1)",
        }}
      >
        <div className="text-left px-8">
          <div>
            <div className="h-14 w-96 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 w-[500px] bg-gray-300 rounded mb-2"></div>
            <div className="h-8 w-[400px] bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="relative min-h-screen pb-16 bg-white mb-24 overflow-hidden">
      <div
        className="w-screen animate-pulse"
        style={{
          backgroundColor: "rgba(123, 217, 56, 1)",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "60px",
          paddingBottom: "60px",
        }}
      >
        <div className="text-left">
          <div>
            <div className="h-14 w-96 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 w-[500px] bg-gray-300 rounded mb-2"></div>
            <div className="h-8 w-[400px] bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="p-4">
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
        </div>

        <div className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="h-24 w-full bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="p-4">
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
        </div>

        <div className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="h-24 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div
          className="flex w-full"
          style={{
            paddingLeft: "60px",
            paddingRight: "60px",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          <div className="flex w-full">
            <div className="w-full h-12 bg-gray-300 rounded-l-md"></div>
            <div className="w-24 h-12 bg-gray-300 rounded-r-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
