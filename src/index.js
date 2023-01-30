
import React, { useState } from "react";
import ErrorBoundary from "./lib/components/ErrorBoundary";
import { render } from "react-dom";
import { Table } from "./lib";
import { useSortableData } from "./lib/customHooks/useSortableData";
import { mockData ,mockHeaderArr } from "./utils/constants";
import "./index.css";

export default function App() {
  const [filteredData] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);

  const { items, requestSort} =
    useSortableData(filteredData);

  return (
    <div className="App">
    <ErrorBoundary>
      <Table
              data={items}
              title={"Employee Details"}
              requestSort={requestSort}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              headerTitleArr={mockHeaderArr}
              applySortonCol={["position_applied","year_of_experience"]}
            />
    </ErrorBoundary>
    </div>
  );
}


render(<App />, document.getElementById("root"));



