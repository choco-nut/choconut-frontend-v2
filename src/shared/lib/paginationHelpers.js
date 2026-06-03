// src/helpers/paginationHelpers.js

export const getPageItems = (items, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

export const getTotalPages = (items, itemsPerPage) => {
  return Math.ceil(items.length / itemsPerPage);
};
 