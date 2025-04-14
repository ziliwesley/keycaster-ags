import { Variable, bind } from "astal";
import { Gtk } from "astal/gtk4";
import { VisualizerContext } from "../base/type";

/**
 * Interface defining the props for the Svelte component.
 */
interface SvelteProps
  extends Pick<
    VisualizerContext,
    | "isShiftKeyPressed"
    | "isCommandKeyPressed"
    | "isAltKeyPressed"
    | "isCtrlKeyPressed"
  > {
  /**
   * A reactive variable representing the text displayed in the key area.
   */
  keyAreaText: Variable<string>;
}

/**
 * A Svelte component that visualizes key presses and displays a key area.
 *
 * @param props - The props for the component, including reactive variables for key states.
 * @returns A JSX element representing the visualizer.
 */
export function Svelte(props: SvelteProps) {
  // Create a fixed container for the layout.
  const container = new Gtk.Fixed();
  const containerWidth = 240;
  const containerHeight = 120;
  const overlayMargin = 20;

  // Set the size and visibility properties of the container.
  container.set_size_request(containerWidth, containerHeight); // Set fixed size.
  container.visible = true;

  // Create a label bound to the keyAreaText property.
  const label = (
    <label
      cssClasses={["key_area"]}
      halign={Gtk.Align.END}
      label={bind(props.keyAreaText)}
    />
  );

  // Create an overlay to position the label.
  // this overlay allows overflowed text content to be clipped.
  const overlay = new Gtk.Overlay();
  overlay.set_size_request(containerWidth, containerHeight); // Set fixed size.
  overlay.visible = true;

  // Add the label to the overlay and configure its alignment.
  overlay.add_overlay(label);
  overlay.set_clip_overlay(label, true);

  // Add the overlay to the container at a specific position.
  container.put(overlay, overlayMargin, 0);

  // Return the main layout containing the visualizer and modifier key buttons.
  return (
    <box vertical>
      <box
        cssClasses={["title"]}
        width_request={containerWidth + overlayMargin * 2}
      >
        {container}
      </box>
      <box homogeneous spacing={0} cssClasses={["button-bar"]}>
        {/* Button for the Shift key */}
        <button
          cssClasses={bind(props.isShiftKeyPressed).as((v) => {
            return v
              ? ["modifier-key", "modifer-shift", "pressed"]
              : ["modifier-key", "modifer-shift"];
          })}
        >
          ⇧
        </button>
        {/* Button for the Command key */}
        <button
          cssClasses={bind(props.isCommandKeyPressed).as((v) => {
            return v
              ? ["modifier-key", "modifer-command", "pressed"]
              : ["modifier-key", "modifer-command"];
          })}
        >
          ⌘
        </button>
        {/* Button for the Alt key */}
        <button
          cssClasses={bind(props.isAltKeyPressed).as((v) => {
            return v
              ? ["modifier-key", "modifer-option", "pressed"]
              : ["modifier-key", "modifer-option"];
          })}
        >
          ⌥
        </button>
        {/* Button for the Control key */}
        <button
          cssClasses={bind(props.isCtrlKeyPressed).as((v) => {
            return v
              ? ["modifier-key", "modifer-control", "pressed"]
              : ["modifier-key", "modifer-control"];
          })}
        >
          ⌃
        </button>
      </box>
    </box>
  );
}
