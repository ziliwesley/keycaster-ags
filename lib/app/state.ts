import { Variable } from "astal";

/**
 * Configuration object for the application.
 */
export const AppConfig = {
  /**
   * Determines if mouse actions should be displayed.
   */
  showMouseAction: true,
  /**
   * Specifies the timeout duration in milliseconds.
   */
  timeout: 500,
};

/**
 * State object for the application.
 */
export const AppState = {
  /**
   * indicating whether the application is paused.
   */
  paused: Variable(false),
};

/**
 * Toggles the paused state of the application.
 * If the application is currently paused, it will be unpaused, and vice versa.
 */
export function toggleAppState() {
  AppState.paused.set(!AppState.paused.get());
}
