import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Table } from "../lib";
import { useSortableData } from "../lib/customHooks/useSortableData";
import "./index.css";
import { mockData  } from "../utils/constants";

const stories = storiesOf('App Test', module);

stories.add('App', () => {
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);

  const { items, requestSort, sortConfig, setSortConfig } =
    useSortableData(filteredData);

  return (
    <div className="App">
      <Table
              data={mockData}
              // requestSort={requestSort}
              currentPage={1}
              setCurrentPage={setCurrentPage}
            />
    </div>)
});
