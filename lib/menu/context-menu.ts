import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";
import { AppState } from "../app/state";

/**
 * Attaches menu items for switching between monitors to the given menu.
 *
 * @param menu - The Gio.Menu to which the items will be added.
 * @param actGrp - The Gio.SimpleActionGroup to which the actions will be added.
 */
function attachMonitorSwitchMenuItems(
  menu: Gio.Menu,
  actGrp: Gio.SimpleActionGroup,
) {
  // Retrieve available monitors
  const monitors = App.get_monitors();

  if (monitors.length <= 1) {
    return;
  }

  // Create an action for switching monitors
  const actSwitchMonitor = new Gio.SimpleAction({
    name: "switch-monitor",
    // Accepts an integer parameter
    parameterType: new GLib.VariantType("i"),
  });

  // Connect the action to a handler for switching monitors
  actSwitchMonitor.connect("activate", (_, param) => {
    // Unpack the monitor ID
    const monitorId: number = param.unpack();
    console.log("Switching monitor", monitorId);

    // Update the application state
    AppState.monitorId.set(monitorId);
  });

  // Add a menu item for each monitor
  for (let i = 0; i < monitors.length; i++) {
    const monitor = monitors[i];
    console.log("Monitor properties", monitor.model, monitor.connector);

    const item = new Gio.MenuItem();
    // Label for the menu item
    item.set_label(`Move to ${monitor.connector}: ${monitor.model}`);
    item.set_action_and_target_value(
      // Action name
      "_app.switch-monitor",
      // Target value (monitor index)
      new GLib.Variant("i", i),
    );

    // Append the item to the menu
    menu.append_item(item);

    // Add the action to the action group
    actGrp.add_action(actSwitchMonitor);
  }
}

/**
 * Attaches a "Quit" menu item to the given menu.
 *
 * @param menu - The Gio.Menu to which the item will be added.
 * @param actGrp - The Gio.SimpleActionGroup to which the action will be added.
 */
function attachQuitMenuItem(menu: Gio.Menu, actGrp: Gio.SimpleActionGroup) {
  // Quit action
  const actQuit = new Gio.SimpleAction({ name: "quit" });

  actQuit.connect("activate", () => {
    console.log("Closing");
    // Quit the application
    App.quit();
  });

  // Add the quit item to the menu
  menu.append("Quit", "_app.quit");
  // Add the quit action to the action group
  actGrp.add_action(actQuit);
}

/**
 * Configures the context menu for the application.
 *
 * @returns An object containing functions to add the context menu to a window
 * and handle right-click events.
 */
export function configure() {
  // Main menu model
  const menu = new Gio.Menu();

  // Action group for app-specific actions
  const appActGrp = new Gio.SimpleActionGroup();

  const popover = new Gtk.PopoverMenu({
    // Enables sliding transitions
    flags: Gtk.PopoverMenuFlags.SLIDING,
    // Positions the menu to the right
    position: Gtk.PositionType.RIGHT,
  });

  attachMonitorSwitchMenuItems(menu, appActGrp);
  attachQuitMenuItem(menu, appActGrp);

  // Set the menu model for the popover
  popover.set_menu_model(menu);

  /**
   * Adds the context menu to the specified window.
   *
   * @param win - The Astal.Window to which the context menu will be added.
   */
  function addContextMenu(win: Astal.Window) {
    // Insert the action group into the window
    win.insert_action_group("_app", appActGrp);
  }

  /**
   * Handles right-click events to show the context menu.
   *
   * @param widget - The Gtk.Widget that received the event.
   * @param evt - The Gdk.ButtonEvent representing the button press.
   */
  function handleButtonPressed(widget: Gtk.Widget, evt: Gdk.ButtonEvent) {
    // Check for button press event
    if (
      evt.get_event_type() === Gdk.EventType.BUTTON_PRESS &&
      // Check if the right mouse button was pressed
      evt.get_button() === 3
    ) {
      // Set the parent widget for the popover
      popover.set_parent(widget);
      // Show the popover menu
      popover.popup();
    }
  }

  // Return the functions for external use
  return {
    addContextMenu: addContextMenu,
    handleButtonPressed: handleButtonPressed,
  };
}
