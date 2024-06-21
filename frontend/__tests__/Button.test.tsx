import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/ui/components/Button";
import SocialSparkleLogo from "@/../public/social-sparkle-logo.svg";

describe("<Button />", () => {
  let log: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render a <button /> HTML element", () => {
    render(
      <Button
        action={() => console.log("button triggered")}
        altText="Logo button"
        buttonPic={SocialSparkleLogo}
      />
    );
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("should be rendered with the given image source and alt text", () => {
    render(
      <Button
        action={() => console.log("button triggered")}
        altText="Logo button"
        buttonPic={SocialSparkleLogo}
      />
    );
    const buttonImage = screen.getByRole("img");

    expect(buttonImage).toBeInTheDocument();
    expect(buttonImage).toHaveAttribute("alt", "Logo button");
  });

  it("should trigger the given command passed as the 'action' prop", () => {
    render(
      <Button
        action={() => console.log("button triggered")}
        altText="Logo button"
        buttonPic={SocialSparkleLogo}
      />
    );
    log = jest.spyOn(global.console, "log");
    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);

    expect(log).toHaveBeenCalledWith("button triggered");

    log.mockRestore();
  });
});
