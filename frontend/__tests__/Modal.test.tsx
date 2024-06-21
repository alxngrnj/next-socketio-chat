import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../src/ui/components/Modal";
import useStore from "../src/lib/storage/state";
import Home from "@/app/page";
import { Modals } from "@/lib/types/next";

const initialStoreState = useStore.getState();

describe("<Modal />", () => {
  const { activeModal, setActiveModal, setIsMounted } = useStore();

  it("should render a div wrapper", async () => {
    setActiveModal("socket");
    render(
      <Modal>
        <p>test</p>
      </Modal>
    );
    expect(activeModal).toBe("users");
    const parentDiv = () => screen.findByTestId("socket");

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

  it("should render different modals according to state", () => {
    setActiveModal("users");
    render(
      <Modal data-testid="modal-wrapper">
        <p>test string</p>
      </Modal>
    );
    const parentDiv = () => screen.findByTestId("users");

    expect(parentDiv).toHaveClass("users-list");

    expect(parentDiv).toHaveClass("name-modal-container");
  });

  afterEach(() => jest.clearAllMocks());
});
