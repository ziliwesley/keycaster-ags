import { KeyEvent, KeyState } from "../input-manager/key-event";
import { svelte, VisualizerContext } from "../visualizer";

/**
 * Interface representing a consumer of key events that extends the
 * VisualizerContext, excluding the "output" property.
 */
interface KeyEventConsumer extends Omit<VisualizerContext, "output"> {
  /**
   * Consumes a key event and processes it.
   *
   * @param evt - The key event to process.
   */
  consumeKeyEvent: (evt: KeyEvent) => void;
}

/**
 * Initializes and returns a KeyEventConsumer instance.
 *
 * The KeyEventConsumer is responsible for processing key events
 * and delegating them to the appropriate handlers.
 *
 * @returns An instance of KeyEventConsumer.
 */
export function initKeyEventConsumer(): KeyEventConsumer {
  // TODO: visualizer can be chosen here based on user's config
  const visualizer = svelte;

  // Configure the visualizer and obtain its context
  const ctx = visualizer.configure();

  /**
   * Processes a key event by delegating to the visualizer.
   *
   * @param evt - The key event to process.
   */
  const consumeKeyEvent = (evt: KeyEvent) => {
    console.log("key event received", evt);

    if (evt.state_code === KeyState.PRESSED) {
      visualizer.handleKeyPressed(evt, ctx);
    }

    if (evt.state_code === KeyState.RELEASED) {
      visualizer.handleKeyReleased(evt, ctx);
    }
  };

  return {
    isShiftKeyPressed: ctx.isShiftKeyPressed,
    isCommandKeyPressed: ctx.isCommandKeyPressed,
    isAltKeyPressed: ctx.isAltKeyPressed,
    isCtrlKeyPressed: ctx.isCtrlKeyPressed,
    dynamicText: ctx.dynamicText,
    consumeKeyEvent,
  };
}
