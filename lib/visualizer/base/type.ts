import { Variable } from "astal";
import { KeyEvent } from "../../input-manager/key-event";

/**
 * Represents the context in which a visualizer operates.
 */
export interface VisualizerContext {
  /**
   * Indicates whether the Shift key is currently pressed.
   */
  isShiftKeyPressed: Variable<boolean>;

  /**
   * Indicates whether the Command key (or Meta key) is currently pressed.
   */
  isCommandKeyPressed: Variable<boolean>;

  /**
   * Indicates whether the Alt key is currently pressed.
   */
  isAltKeyPressed: Variable<boolean>;

  /**
   * Indicates whether the Control key is currently pressed.
   */
  isCtrlKeyPressed: Variable<boolean>;

  /**
   * A dynamic text value that can be updated and observed.
   */
  dynamicText: Variable<string>;

  /**
   * Outputs a string to the visualizer's output mechanism.
   *
   * @param input - The string to output.
   */
  output: (input: string) => void;
}

/**
 * Represents a visualizer that processes key events and manages its context.
 */
export interface Visualizer {
  /**
   * Handles a key press event.
   *
   * @param evt - The key event representing the key press.
   * @param ctx - The context in which the visualizer operates.
   */
  handleKeyPressed(evt: KeyEvent, ctx: VisualizerContext): void;

  /**
   * Handles a key release event.
   *
   * @param evt - The key event representing the key release.
   * @param ctx - The context in which the visualizer operates.
   */
  handleKeyReleased(evt: KeyEvent, ctx: VisualizerContext): void;

  /**
   * Configures and initializes the visualizer's context.
   *
   * @returns The initialized visualizer context.
   */
  configure(): VisualizerContext;
}
