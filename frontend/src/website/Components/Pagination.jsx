import React, { useState } from "react";

const Pagination = ({ totalPages = 5 }) => {
  const [activePage, setActivePage] = useState(1);

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4 bg-gray-100 rounded-lg">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
            activePage === page
              ? "bg-black text-white"
              : "bg-transparent text-black hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
