import React, { Component, Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

const Pagination = (props) => {
  const pageLimit = props?.pageLimit || 30;
  const totalRecords = props?.totalRecords || 0;
  const pageNeighbours = props?.pageNeighbours || 0;
  const totalPages = Math.ceil(totalRecords / pageLimit);
  const [currentPage, setCurrentPage] = useState(1);

  const gotoPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages)));

    const paginationData = {
      currentPage,
      totalPages: totalPages,
      pageLimit: pageLimit,
      totalRecords: totalRecords
    };
    props.onPageChanged(paginationData);
  }

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

  if (!totalRecords || totalPages === 1) return null;

  const pages = fetchPageNumbers();
  return (
    <Fragment>
      <nav aria-label="Countries Pagination">
        <ul className="pagination mypagination">
          <li key='first' className="page-item">
            <a className="page-link" href="#" aria-label="Previous" onClick={() => gotoPage(1)}>
              <span className="sr-only">{'<<'}</span>
            </a>
          </li>
          <li key='previous' className="page-item">
            <a className="page-link" href="#" aria-label="Previous" onClick={() => gotoPage(currentPage - 1)}>
              <span className="sr-only">{'<'}</span>
            </a>
          </li>
          { pages.map((page, index) => {
            return (
              <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                <a className="page-link" href="#" onClick={() => gotoPage(page)}>{ page }</a>
              </li>
            );
          }) }
          <li key='next' className="page-item">
            <a className="page-link" href="#" aria-label="Next" onClick={() => gotoPage(currentPage + 1)}>
              <span className="sr-only">{'>'}</span>
            </a>
          </li>
          <li key='last' className="page-item">
            <a className="page-link" href="#" aria-label="Next" onClick={() => gotoPage(totalPages)}>
              <span className="sr-only">{'>>'}</span>
            </a>
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
