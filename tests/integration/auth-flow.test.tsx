import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

// mock next/navigation so router.push doesnt crash in tests
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// clear localStorage before each test so tests dont affect each other
beforeEach(() => {
  localStorage.clear();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", () => {
    render(<SignupForm />);

    // type into email and password fields
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });

    // click submit
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    // session should now exist in localStorage
    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") ?? "null"
    );
    expect(session).not.toBeNull();
    expect(session.email).toBe("test@example.com");
  });

  it("shows an error for duplicate signup email", () => {
    // create a user first
    const { unmount } = render(<SignupForm />);
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    // unmount first form before rendering second
    unmount();

    // render fresh signup form
    render(<SignupForm />);

    // try signing up with same email again
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    // error message should appear
    expect(screen.getByText("User already exists")).toBeInTheDocument();
  });

  it("submits the login form and stores the active session", () => {
    // first create a user via signup
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    // clear session so we can test login fresh
    localStorage.removeItem("habit-tracker-session");

    // now test login
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    // session should be restored
    const session = JSON.parse(
      localStorage.getItem("habit-tracker-session") ?? "null"
    );
    expect(session).not.toBeNull();
    expect(session.email).toBe("test@example.com");
  });

  it("shows an error for invalid login credentials", () => {
    render(<LoginForm />);

    // type wrong credentials
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    // error message should appear
    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
