import { test, expect } from "@playwright/test";

// helper to sign up a fresh user
async function signUpUser(page: any, email: string, password: string) {
  await page.goto("/signup");
  await page.fill('[data-testid="auth-signup-email"]', email);
  await page.fill('[data-testid="auth-signup-password"]', password);
  await page.click('[data-testid="auth-signup-submit"]');
  await page.waitForURL("/dashboard");
}

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    // clear storage so no session exists
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");

    // splash screen should be visible
    await expect(page.getByTestId("splash-screen")).toBeVisible();

    // should redirect to login after splash duration
    await page.waitForURL("/login", { timeout: 5000 });
    await expect(page).toHaveURL("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    // sign up first to create a session
    await signUpUser(page, "user1@test.com", "password123");

    // go back to root
    await page.goto("/");

    // should redirect to dashboard since session exists
    await page.waitForURL("/dashboard", { timeout: 5000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    // clear storage
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // try to access dashboard directly
    await page.goto("/dashboard");

    // should be redirected to login
    await page.waitForURL("/login", { timeout: 5000 });
    await expect(page).toHaveURL("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    // fill in signup form
    await page.fill('[data-testid="auth-signup-email"]', "newuser@test.com");
    await page.fill('[data-testid="auth-signup-password"]', "password123");
    await page.click('[data-testid="auth-signup-submit"]');

    // should land on dashboard
    await page.waitForURL("/dashboard", { timeout: 5000 });
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // sign up first
    await signUpUser(page, "existing@test.com", "password123");

    // create a habit
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "My Private Habit");
    await page.click('[data-testid="habit-save-button"]');

    // log out
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL("/login");

    // sign up a second user
    await signUpUser(page, "other@test.com", "password123");

    // second user should not see first user habits
    await expect(
      page.getByTestId("habit-card-my-private-habit")
    ).not.toBeVisible();

    // log out second user
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL("/login");

    // log back in as first user
    await page.fill('[data-testid="auth-login-email"]', "existing@test.com");
    await page.fill('[data-testid="auth-login-password"]', "password123");
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForURL("/dashboard");

    // first user should see their habit
    await expect(page.getByTestId("habit-card-my-private-habit")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signUpUser(page, "creator@test.com", "password123");

    // click add habit button
    await page.click('[data-testid="create-habit-button"]');

    // fill in form
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.fill('[data-testid="habit-description-input"]', "Stay hydrated");

    // save
    await page.click('[data-testid="habit-save-button"]');

    // habit card should appear
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signUpUser(page, "completer@test.com", "password123");

    // create a habit
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.click('[data-testid="habit-save-button"]');

    // streak should start at 0
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "0 day streak"
    );

    // mark as complete
    await page.click('[data-testid="habit-complete-drink-water"]');

    // streak should update to 1
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "1 day streak"
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signUpUser(page, "persist@test.com", "password123");

    // create a habit
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.click('[data-testid="habit-save-button"]');

    // reload the page
    await page.reload();

    // should still be on dashboard — session persisted
    await expect(page).toHaveURL("/dashboard");

    // habit should still be there — data persisted
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signUpUser(page, "logout@test.com", "password123");

    // click logout
    await page.click('[data-testid="auth-logout-button"]');

    // should redirect to login
    await page.waitForURL("/login", { timeout: 5000 });
    await expect(page).toHaveURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
  }) => {
    await signUpUser(page, "offline@test.com", "password123");

    // go online first to cache the app
    await page.goto("/");
    await page.waitForURL("/dashboard");

    // simulate going offline
    await page.context().setOffline(true);

    // try to load the app offline
    await page.goto("/");

    // app should load without crashing
    // either splash screen or redirect should work
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // go back online
    await page.context().setOffline(false);
  });
});
