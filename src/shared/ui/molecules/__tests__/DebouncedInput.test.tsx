import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DebouncedInput } from "#/shared/ui/molecules/DebouncedInput";

describe("DebouncedInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces onChange until the timeout elapses", () => {
    const handleChange = vi.fn();

    render(
      <DebouncedInput
        value=""
        onChange={handleChange}
        timeout={300}
        label="Search"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Search" });
    fireEvent.change(input, { target: { value: "abc" } });

    expect(handleChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("abc");
  });

  it("syncs the displayed value when the external value changes and nothing is pending", () => {
    const handleChange = vi.fn();

    const Controlled: React.FC = () => {
      const [value, setValue] = useState("alpha");

      return (
        <>
          <button type="button" onClick={() => setValue("beta")}>
            Set external
          </button>
          <DebouncedInput
            value={value}
            onChange={handleChange}
            timeout={500}
            label="Field"
          />
        </>
      );
    };

    render(<Controlled />);

    const input = screen.getByRole("textbox", { name: "Field" });
    expect(input).toHaveValue("alpha");

    fireEvent.click(screen.getByRole("button", { name: "Set external" }));

    expect(input).toHaveValue("beta");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not overwrite in-progress typing when the external value changes", () => {
    const handleChange = vi.fn();

    const Controlled: React.FC = () => {
      const [value, setValue] = useState("alpha");

      return (
        <>
          <button type="button" onClick={() => setValue("beta")}>
            Set external
          </button>
          <DebouncedInput
            value={value}
            onChange={handleChange}
            timeout={500}
            label="Field"
          />
        </>
      );
    };

    render(<Controlled />);

    const input = screen.getByRole("textbox", { name: "Field" });
    fireEvent.change(input, { target: { value: "alphatyping" } });

    expect(input).toHaveValue("alphatyping");

    fireEvent.click(screen.getByRole("button", { name: "Set external" }));

    expect(input).toHaveValue("alphatyping");

    vi.advanceTimersByTime(500);

    expect(input).toHaveValue("alphatyping");
    expect(handleChange).toHaveBeenCalledWith("alphatyping");
  });
});
