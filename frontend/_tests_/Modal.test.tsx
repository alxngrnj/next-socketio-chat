import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Modal from "../src/ui/components/Modal";

describe("<Modal />", () => {
  beforeAll(() => {
    render(
      <Modal>
        <ul data-testid="test-ul">
          <li className="test-li">
            <p>teste 1</p>
          </li>
          <li className="test-li">
            <p>teste 2</p>
          </li>
          <li className="test-li">
            <p>teste 3</p>
          </li>
        </ul>
      </Modal>
    );
  });

  it("renders a div wrapper", () => {
    const parentDiv = screen.getByTestId("modal-div-wrapper");
    console.log(parentDiv);
    expect(parentDiv).toBeInTheDocument();
  });

  // it("renders the elements passed down as children", () => {
  //   const ul = screen.getByTestId("test-ul");

  //   expect(ul).toBeInTheDocument();
  // });
});
