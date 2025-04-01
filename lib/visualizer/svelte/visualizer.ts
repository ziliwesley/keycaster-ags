import { Variable } from "astal";
import { AppConfig } from "../../app/state";
import {
  EventName,
  isAltKey,
  isCommandKey,
  isCtrlKey,
  isShiftKey,
  KeyEvent,
} from "../../input-manager/key-event";
import {
  KeyShifedSymbolMap,
  MouseBtnMap,
  SpecialKeySymbolMap,
} from "../../input-manager/key-mapping";
import { clearTimeoutOrInterval, setTimeout } from "../../utils/timeout";
import { Visualizer, VisualizerContext } from "../base/type";

/**
 * Handles key press events and updates the visualizer context accordingly.
 * @param evt - The key event object containing details about the key press.
 * @param ctx - The visualizer context to update based on the key press.
 */
function handleKeyPressed(evt: KeyEvent, ctx: VisualizerContext) {
  // Mouse events
  if (evt.event_name === EventName.POINTER_BUTTON) {
    if (AppConfig.showMouseAction) {
      ctx.output(MouseBtnMap[evt.key_name]);
      return;
    } else {
      return;
    }
  }

  // Handle modifier keys
  if (isShiftKey(evt)) {
    ctx.isShiftKeyPressed.set(true);
    ctx.output("⇧");
    return;
  }

  if (isCommandKey(evt)) {
    ctx.isCommandKeyPressed.set(true);
    ctx.output("⌘");
    return;
  }

  if (isAltKey(evt)) {
    ctx.isAltKeyPressed.set(true);
    ctx.output("⌥");
    return;
  }

  if (isCtrlKey(evt)) {
    ctx.isCtrlKeyPressed.set(true);
    ctx.output("⌃");
    return;
  }

  // Handle letter keys
  if (evt.key_name.match(/^KEY_[A-Z]$/)) {
    const keyName = evt.key_name.replace(/KEY_/, "").toLowerCase();

    if (ctx.isShiftKeyPressed.get()) {
      ctx.output(keyName.toUpperCase());
    } else {
      ctx.output(keyName);
    }
    return;
  }

  // Handle number keys
  if (evt.key_name.match(/^KEY_[0-9]$/)) {
    const keyName = evt.key_name.replace(/KEY_/, "").toLowerCase();

    if (ctx.isShiftKeyPressed.get()) {
      ctx.output(KeyShifedSymbolMap[evt.key_name]);
    } else {
      ctx.output(keyName);
    }
    return;
  }

  // Handle other keys matching key maps
  if (SpecialKeySymbolMap[evt.key_name]) {
    if (ctx.isShiftKeyPressed.get()) {
      if (KeyShifedSymbolMap[evt.key_name]) {
        ctx.output(KeyShifedSymbolMap[evt.key_name]);
        return;
      }
    }

    ctx.output(SpecialKeySymbolMap[evt.key_name]);
    return;
  }

  console.log("Unknown key event", evt);
  ctx.output(evt.key_name);
}

/**
 * Handles key release events and updates the visualizer context accordingly.
 * @param evt - The key event object containing details about the key release.
 * @param ctx - The visualizer context to update based on the key release.
 */
function handleKeyReleased(evt: KeyEvent, ctx: VisualizerContext) {
  // Handle modifier keys
  if (isShiftKey(evt)) {
    ctx.isShiftKeyPressed.set(false);
    return;
  }

  if (isCommandKey(evt)) {
    ctx.isCommandKeyPressed.set(false);
    return;
  }

  if (isAltKey(evt)) {
    ctx.isAltKeyPressed.set(false);
    return;
  }

  if (isCtrlKey(evt)) {
    ctx.isCtrlKeyPressed.set(false);
    return;
  }
}

/**
 * Visualizer object that handles key press and release events and provides configuration.
 */
const visualizer: Visualizer = {
  handleKeyPressed,
  handleKeyReleased,
  /**
   * Configures the visualizer context with necessary state variables and output logic.
   * @returns The visualizer context with state variables and output function.
   */
  configure() {
    const isShiftKeyPressed = Variable(false);
    const isCommandKeyPressed = Variable(false);
    const isAltKeyPressed = Variable(false);
    const isCtrlKeyPressed = Variable(false);
    const dynamicText = Variable("");

    let timeoutId: number;

    /**
     * Outputs the given string to the dynamic text variable and manages timeout for clearing it.
     * @param out - The string to output.
     */
    const output = (out: string) => {
      dynamicText.set(dynamicText.get() + out);

      if (AppConfig.timeout > 0) {
        // Clear the previous timeout if it exists
        if (timeoutId) {
          clearTimeoutOrInterval(timeoutId);
        }

        timeoutId = setTimeout(() => {
          dynamicText.set("");
          timeoutId = 0;
        }, AppConfig.timeout);
      }
    };

    return {
      isShiftKeyPressed,
      isCommandKeyPressed,
      isAltKeyPressed,
      isCtrlKeyPressed,
      dynamicText,
      output,
    };
  },
};

export { visualizer };
