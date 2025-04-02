#!/usr/bin/env -S ags run --gtk4

import { bind } from "astal";
import { App, Astal } from "astal/gtk4";
import Gtk from "gi://Gtk?version=4.0";
import { initKeyEventConsumer } from "./lib/app/init";
import { AppConfig, AppState, toggleAppState } from "./lib/app/state";
import { parseKeyEvent } from "./lib/input-manager/key-event";
import { spawnKeyInputWatcher } from "./lib/input-manager/watcher";
import { configure } from "./lib/menu/context-menu";
import { getStdinDataStream, readUntil } from "./lib/utils/pipe";
import { Svelte } from "./lib/visualizer/svelte/svelte";

// Import package metadata
const pkg = await import("./package.json");

// Start the application
App.start({
  // Define the instance name and CSS file
  instanceName: pkg["name"] ?? "keycaster-ags",
  css: "./style/main.css",

  /**
   * Main function executed when the app starts.
   *
   * @param action - The action passed to the app (e.g., "--stdin").
   */
  main: (action) => {
    console.log("Running as main", action);

    // Initialize key event consumer and retrieve state variables
    const {
      isShiftKeyPressed,
      isCommandKeyPressed,
      isAltKeyPressed,
      isCtrlKeyPressed,
      consumeKeyEvent,
      dynamicText,
    } = initKeyEventConsumer();

    if (action === "--stdin") {
      // Handle data piped into the app via stdin
      // Example usage:
      // showmethekey-cli | ./main.tsx
      const dis = getStdinDataStream();

      // Read and process incoming data stream
      readUntil(dis, (data) => {
        const content = JSON.parse(data);

        // Ignore events if the app is paused
        if (AppState.paused.get()) {
          return;
        }

        consumeKeyEvent(content);
      });
    } else {
      // Spawn a subprocess to watch for key events
      spawnKeyInputWatcher((data: string) => {
        const evt = parseKeyEvent(data);

        // Ignore events if the app is paused
        if (AppState.paused.get()) {
          return;
        }

        consumeKeyEvent(evt);
      });
    }

    const { addContextMenu, handleButtonPressed } = configure();

    /**
     * Sets up the main application window.
     *
     * @param win - The Astal.Window instance to configure.
     */
    function setup(win: Astal.Window) {
      addContextMenu(win);
    }

    // Define the main application window
    <window
      setup={setup}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      halign={Gtk.Align.END}
      anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
      cssClasses={["main"]}
      opacity={AppConfig.opacity}
      marginLeft={16}
      marginBottom={16}
      monitor={bind(AppState.monitorId)}
      visible={bind(AppState.paused).as((v) => !v)}
      onButtonPressed={handleButtonPressed}
    >
      {/* Render the Svelte component with key state bindings */}
      <Svelte
        isShiftKeyPressed={isShiftKeyPressed}
        isCommandKeyPressed={isCommandKeyPressed}
        isAltKeyPressed={isAltKeyPressed}
        isCtrlKeyPressed={isCtrlKeyPressed}
        keyAreaText={dynamicText}
      />
    </window>;
  },

  /**
   * Function executed for subsequent client calls.
   *
   * This function is invoked when the script is executed while an existing
   * instance of the application is already running. It allows communication
   * with the main instance.
   *
   * @param message - A function to send messages to the main instance.
   * @param args - Command-line arguments passed to the client.
   */
  client(message: (msg: string) => string, ...args: Array<string>) {
    console.log("Running as client", message, args);

    if (args.length > 0) {
      // Process command-line arguments
      if (args.includes("--toggle")) {
        message("toggle");
      }
    }
  },

  /**
   * Request handler for the main instance.
   *
   * @param request - The request string sent to the main instance.
   * @param res - A function to send a response back to the client.
   */
  requestHandler(request: string, res: (response: any) => void) {
    // Example usage to toggle the app:
    // astal -i keycaster-ags toggle
    // or
    // ags run ./main.tsx -a --toggle
    if (request === "toggle") {
      console.log("toggle request received");
      toggleAppState();
    }

    // Respond to the request
    res("ok");
  },
});
