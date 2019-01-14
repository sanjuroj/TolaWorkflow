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
            previousLabel={<i className="fa fa-angle-left"></i>}
            nextLabel={<i className="fa fa-angle-right"></i>}
            breakLabel={"..."}
            breakClassName={"break-me"}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            {...props}/>
}

export default Pagination
