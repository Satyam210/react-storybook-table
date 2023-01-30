import { render, screen } from "@testing-library/react";
import { cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import Table from "./index";
import { mockData } from "../../../utils/constants";

const flushPromises = async (timeout = 0) =>
  await act(
    async () => await new Promise((resolve) => setTimeout(resolve, timeout))
  );
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("Testing Table Page and functionality", () => {

  it("renders Table component and check Filters functionality", async () => {
    
    const { container, getByText } = render(
      <Table
        data={mockData}
        title={"Employee Details"}
        requestSort={jest.fn()}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );
    await flushPromises(50);

    //basic UI component visibilty check
    expect(getByText("Employee Details")).toBeInTheDocument();
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
    const thead = table.querySelector("thead");
    expect(thead).toBeInTheDocument();
    const headers = thead.querySelectorAll("th");
    expect(headers.length).toEqual(7);
    const tbody = table.querySelector("tbody");
    expect(tbody.rows.length).toEqual(10);
    const checkbox = container.querySelector("input[type='checkbox']");

    expect(checkbox).toBeInTheDocument();
    expect(screen.queryByText("Colette Morar")).toBeInTheDocument();
  });

  it("check Sorting functionality", async () => {

    const requestSortSpy = jest.fn();
    const mockApplySortColArr = [
      { key: "position_applied", value: "Position Applied" },
      { key: "year_of_experience", value: "Year Of Experience" },
    ];
    render(
      <Table
        data={mockData}
        title={"Employee Details"}
        requestSort={requestSortSpy}
        applySortonCol={mockApplySortColArr.map((ele) => ele.key)}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );
    await flushPromises(50);

    const sortAppliedCols = document.getElementsByName("sort-col");
    expect(sortAppliedCols.length).toEqual(2);

    mockApplySortColArr.forEach((sortColObj) => {
      const position_applied = screen.getByText(sortColObj.value);
      fireEvent.click(position_applied);

      expect(requestSortSpy).toHaveBeenCalled();
    });
  });

  it("should render Tabular Data with Pagination", async () => {
    const setCurrentPageSpy = jest.fn();
    const { container } = render(
      <Table
        data={mockData}
        title={"Employee Details"}
        requestSort={jest.fn()}
        currentPage={1}
        setCurrentPage={setCurrentPageSpy}
      />
    );
    await flushPromises(50);

    const pageList = container.querySelector("ul");
    expect(pageList).toBeInTheDocument();
    const list = pageList.querySelectorAll("li");
    // list =>    < , 1, 2, >
    expect(list.length).toEqual(4);

    //When next page is clicked - currentPage is set to 2
    fireEvent.click(list[2]);
    await flushPromises(50);
    expect(setCurrentPageSpy).toHaveBeenCalledWith(2);
  });
});
