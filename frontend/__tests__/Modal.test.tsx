import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import Modal from "../src/ui/components/Modal";
// import useStore from "../src/lib/storage/state";

describe("<Modal />", () => {
  it("should render a div wrapper", () => {
    render(
      <Modal>
        <p>test</p>
      </Modal>
    );
    const parentDiv = screen.getByTestId("modal-div-wrapper");

    expect(parentDiv).toBeInTheDocument();
  });

  it("should render the elements passed down as children", () => {
    render(
      <Modal>
        <ul data-testid="test-ul">
          <li data-testid="test-li-1">
            <p>test string</p>
          </li>
        </ul>
      </Modal>
    );
    const ul = screen.getByTestId("test-ul");
    const li = screen.getByTestId("test-li-1");
    const text = screen.getByText("test string");

    expect(ul).toBeInTheDocument();
    expect(li).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(ul).toContainElement(li);
    expect(ul).toContainElement(text);
  });

  // it("should render different modals according to state", () => {
  //   const { setActiveModal, activeModal } = useStore();
  //   render(
  //     <Modal>
  //       <p>test</p>
  //     </Modal>
  //   );
  //   setActiveModal("users");

  // const parentDiv = () => screen.findByTestId("modal-div-wrapper");
  // expect(parentDiv).toHaveClass("users-list");

  // // Set another active modal
  // act(() => setActiveModal("message"));

  // expect(parentDiv).toHaveClass("users-list");

  // // Reset to original active modal
  // act(() => setActiveModal("name"));

  // expect(parentDiv).toHaveClass("name-modal-container");
  // });
});
