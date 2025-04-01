#!/usr/bin/env -S ags run --gtk4

import { bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk4";
import { initKeyEventConsumer } from "./lib/app/init";
import { AppState, toggleAppState } from "./lib/app/state";
import { parseKeyEvent } from "./lib/input-manager/key-event";
import { spawnKeyInputWatcher } from "./lib/input-manager/watcher";
import { getStdinDataStream, readUntil } from "./lib/utils/pipe";
import { Svelte } from "./lib/visualizer/svelte/svelte";

// Import package metadata
const pkg = await import("./package.json");

// Start the application
App.start({
  // Define the instance name and CSS file
  instanceName: pkg["name"] ?? "keycaster-ags",
  css: "./style/main.css",

  // Main function executed when the app starts
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

    // Define the main application window
    <window
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      halign={Gtk.Align.END}
      anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
      cssClasses={["main"]}
      marginLeft={16}
      marginBottom={16}
      visible={bind(AppState.paused).as((v) => !v)}
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

  // Function executed for subsequent client calls
  client(message: (msg: string) => string, ...args: Array<string>) {
    console.log("Running as client", message, args);

    if (args.length > 0) {
      // Process command-line arguments
      if (args.includes("--toggle")) {
        message("toggle");
      }
    }
  },

  // Request handler for the main instance
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
