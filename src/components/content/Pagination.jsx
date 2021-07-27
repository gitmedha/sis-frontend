import React, { Component, Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

const Pagination = ({pageLimit, totalPages, pageNeighbours = 2, gotoPage, nextPage, previousPage, pageIndex}) => {
  const currentPage = pageIndex + 1;

  const fetchPageNumbers = () => {
    const totalNumbers = (pageNeighbours * 2) + 1;
    if (totalPages > totalNumbers) {
      let startPage = Math.max(1, currentPage - pageNeighbours + Math.max(0, 3 - currentPage));
      let endPage = Math.min(totalPages, currentPage + pageNeighbours + Math.max(0, 3 - currentPage));
      if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - pageNeighbours -  2);
      }
      return range(startPage, endPage);
    }
    return range(1, totalPages);
  }

  if (totalPages === 1) return null;

  const pages = fetchPageNumbers();
  return (
    <Fragment>
      <nav>
        <ul className="pagination">
          <li key='first' className="pagination-link-wrapper">
            <span className={`pagination-link ${currentPage <= 1 ? 'disabled' : ''}`} href="#" aria-label="Previous" onClick={() => gotoPage(0)} disabled={currentPage <= 1}>
              <span className="sr-only"><FaAngleDoubleLeft /></span>
            </span>
          </li>
          <li key='previous' className="pagination-link-wrapper">
            <span className={`pagination-link ${currentPage <= 1 ? 'disabled' : ''}`} href="#" aria-label="Previous" onClick={() => previousPage()} disabled={currentPage <= 1}>
              <span className="sr-only"><FaAngleLeft /></span>
            </span>
          </li>
          { pages.map((page, index) => {
            return (
              <li key={index} className={`pagination-link-wrapper ${ currentPage === page ? 'active' : ''}`}>
                <span className="pagination-link" href="#" onClick={() => gotoPage(page - 1)}>{ page }</span>
              </li>
            );
          }) }
          <li key='next' className="pagination-link-wrapper">
            <span className={`pagination-link ${currentPage >= totalPages ? 'disabled' : ''}`} href="#" aria-label="Next" onClick={() => nextPage()} disabled={currentPage >= totalPages}>
              <span className="sr-only"><FaAngleRight /></span>
            </span>
          </li>
          <li key='last' className="pagination-link-wrapper">
            <span className={`pagination-link ${currentPage >= totalPages ? 'disabled' : ''}`} href="#" aria-label="Next" onClick={() => gotoPage(totalPages - 1)} disabled={currentPage >= totalPages}>
              <span className="sr-only"><FaAngleDoubleRight /></span>
            </span>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}

// Pagination.propTypes = {
//   totalRecords: PropTypes.number.isRequired,
//   pageLimit: PropTypes.number,
//   pageNeighbours: PropTypes.number,
//   onPageChanged: PropTypes.func
// };



export default Pagination;
