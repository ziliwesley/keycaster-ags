import { GLib } from "astal/gobject";

/**
 * Sets a recurring interval to execute a specified function.
 *
 * @param func - The function to execute at each interval.
 * @param interval - The time interval in milliseconds between executions.
 * @returns A numeric ID representing the interval, which can be used to clear it later.
 */
export function setInterval(func: () => void, interval: number) {
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
    func();
    return GLib.SOURCE_CONTINUE; // Returning CONTINUE indicates the interval should continue.
  });
}

/**
 * Clears a timeout or interval using its numeric ID.
 *
 * @param id - The numeric ID of the timeout or interval to clear.
 * @returns A boolean indicating whether the source was successfully removed.
 */
export function clearTimeoutOrInterval(id: number) {
  return GLib.Source.remove(id);
}

/**
 * Sets a one-time timeout to execute a specified function.
 *
 * @param func - The function to execute after the timeout.
 * @param timeout - The time in milliseconds to wait before executing the function.
 * @returns A numeric ID representing the timeout, which can be used to clear it if needed.
 */
export function setTimeout(func: () => void, timeout: number) {
  return GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout, () => {
    func();
    return GLib.SOURCE_REMOVE; // Returning REMOVE indicates the timeout should be cleared.
  });
}
