import React from 'react'
import ReactPaginate from 'react-paginate'
import { observer } from "mobx-react"

/***
    Props:

    - pageCount: total number of pages
    - initialPage: which page should be highlighted as active initially
    - onPageChange: a function to receive the newly selected page
*/
const Pagination = (props) => {
    return <ReactPaginate
            previousLabel={'‹'}
            previousClassName={'page-item previous'}
            previousLinkClassName={'page-link'}
            nextLabel={'›'}
            nextClassName={'page-item next'}
            nextLinkClassName={'page-link'}
            breakLabel={"..."}
            disabledClassName={'disabled'}
            breakClassName={'page-item disabled'}
            breakLinkClassName={'page-link'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            containerClassName={"pagination"}
            activeClassName={"active"}
            {...props}/>
}

export default Pagination
