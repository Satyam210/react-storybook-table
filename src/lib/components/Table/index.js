import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "../Pagination";
import Tag from "../Tag";
import { SortAscendingOutlined } from "@ant-design/icons";
import Loader from "../Loader";
import "./index.css";




/**
     * @description
     * Table(tableProps) method to create a table with sorting and pagination feature.
     * @method
     * @param {array} data - dataSource of Table.
     * @param {boolean} isLoading - show loader while table dataSource is loaded
     * @param {string} title - Table title 
     * @param {array} headerTitleArr - Array of Headers.
     * @param {array} applyTagCol - column header key on which you want tags as values in each cell
     * @param {number} currentPage - starting index of pagination
     * @param {number} pageSize - number of rows to be displayed on firstPage of table
     * @param {Function} setCurrentPage - toggel currentPage of paginated table
     * @param {array} applySortonCol - list of column- header keys in which sorting feature is enabled
     * @param {Function} requestSort - handleSort func for col cells data 
     * @param {boolean} allowRowSelection - should checkbox or radio buttons to be included as col in table
     * @param {string} selectionType - checkbox{defualtVal} / radio
     * @returns {Component} - return a Table component.
     * @public
     */
const Table = ({
  data,
  currentPage = 1,
  setCurrentPage,
  title,
  headerTitleArr,
  applySortonCol=[],
  applyTagCol=["status"],
  requestSort,
  allowRowSelection = true,
  selectionType = "checkbox",
  isLoading= false,
  PageSize = 10,
}) => {
  const [currentPageData, setCurrentPageData] = useState([]);

  const updateCurrentPageData =
    (data) => {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      setCurrentPageData(data?.slice(firstPageIndex, lastPageIndex));
    };

  useEffect(() => {
    updateCurrentPageData(data);
  }, [currentPage, data]);


  /**
   * @description sortColum is triggered on action of sortIcon or sort-col being clicked 
   * @param {string} colKey - column key 
   */
  const sortColumn = (colKey) => {
    requestSort(colKey);
    updateCurrentPageData(data);
  };


    /**
   * @description onMultiSelectClick - handle changes when mutlti-select checkbox is clicked
   * mark rest of the checkboxes of rows as checked and change the background of the rows selected 
   * @param {Node} source - target element on which action is triggered
   */
  const onMultiSelectClick = (source) => {

    const checkboxes = document.getElementsByName("single-select");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = source.checked;
      const parentNodeTR = checkboxes[i]?.parentNode?.parentNode;

      //if multi-select checkbox is marked then fill rest of the checkboxes 
      if (source.checked) parentNodeTR.classList.add("selected");
      else parentNodeTR.classList.remove("selected");
    }
  };


    /**
   * @description onSingleSelection - handle changes when single-select checkbox is clicked
   * In case of radio type selection - unselect previous selected option and highlight the current row
   * In case of checkboc selection - Add current row in the list of previous selected rows
   * @param {node} targetEle - target element on which action is triggered
   */
  const onSingleSelection = (targetEle) => {
    // remove class from the other rows
    var el = document.getElementById("first-tr");
    if (selectionType !== "checkbox") {
      while (el) {
        if (el.tagName === "TR") {
          el.classList.remove("selected");
        }
        el = el.nextSibling;
      }
    }

    var parentEle = targetEle.parentNode;
    parentEle.classList.toggle("selected");
  };

  return (
    <div className={"tableContainer"}>
       <Loader loading={isLoading} />
      {
        <table>
          {title&&<caption>{title}</caption>}
          <thead>
            <tr>
              {allowRowSelection &&
                (selectionType === "radio" ? (
                  <th></th>
                ) : (
                  <th >
                    <input
                      type={selectionType}
                      onClick={(event) =>
                        onMultiSelectClick(event.currentTarget)
                      }
                      className="checkbox-input"
                      value=""
                    />
                  </th>
                ))}
              {headerTitleArr.map(({ key, value }) => {
                return [...applySortonCol
                ].includes(value) ? (
                  <th key={key} onClick={() => sortColumn(value)} name="sort-col">
                    {key}
                    <SortAscendingOutlined style={{ marginLeft: 5 }} />
                  </th>
                ) : (
                  <th key={key}>{key}</th>
                );
              })}
            </tr>
          </thead>
          {currentPageData?.length ? (
            <tbody>
              {currentPageData.map((row, id) => {
                return (
                  <tr key={id} id="first-tr">
                    {allowRowSelection && (
                      <td>
                        <input
                          type={selectionType}
                          className="checkbox-input"
                          name="single-select"
                          value=""
                          onClick={(event) =>
                            onSingleSelection(event.target.parentNode)
                          }
                        />
                      </td>
                    )}
                    {Object.entries(row).map(([key, val])=>{
                      return applyTagCol.includes(key) ? (
                        <td data-title={key} key={key}>
                      <Tag
                        value={val}
                        colorStyle={{
                          color:
                            val === "rejected"
                              ? "red"
                              :val === "waiting"
                                ? "orange"
                                : "green",
                        }}
                      />
                    </td>
                      ) :
                     <td data-title={key} key={key}>{val}</td>
                    })}
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody className="noData">
              <tr><td>NO DATA</td></tr>
            </tbody>
          )}
        </table>
      }
      {data && (
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={data?.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

Table.prototype = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  currentPage: PropTypes.number,
  PageSize: PropTypes.number,
  setCurrentPage: PropTypes.func,
  applySortonCol: PropTypes.array,
  applyTagCol: PropTypes.array,
  requestSort: PropTypes.func,
  allowRowSelection: PropTypes.bool,
  selectionType: PropTypes.string
};
export default Table;
