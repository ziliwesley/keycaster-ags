import { Variable } from "astal";

/**
 * Configuration object for the application.
 */
export const AppConfig = {
  /**
   * Indicates whether mouse actions should be displayed.
   */
  showMouseAction: true,

  /**
   * Timeout duration in milliseconds.
   */
  timeout: 500,

  /**
   * Opacity of the application window.
   *
   * NOTE:
   * To enable blur for gtk4-layer-shell in Hyperland, add the following to hyperland.conf:
   * ```conf
   * layerrule = blur, gtk4-layer-shell
   * ```
   */
  opacity: 0.85,
};

/**
 * State object for the application.
 */
export const AppState = {
  /**
   * Indicates whether the application is paused.
   */
  paused: Variable(false),

  /**
   * ID of the monitor to which the application is attached.
   */
  monitorId: Variable(0),
};

/**
 * Toggles the paused state of the application.
 * If the application is paused, it will be unpaused, and vice versa.
 */
export function toggleAppState() {
  AppState.paused.set(!AppState.paused.get());
}
