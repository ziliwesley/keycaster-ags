export enum KeyState {
  RELEASED = 0,
  PRESSED = 1,
}

export enum EventName {
  KEYBOARD_KEY = "KEYBOARD_KEY",
  POINTER_BUTTON = "POINTER_BUTTON",
}

export interface KeyEvent {
  event_name: string;
  event_type: string;
  key_name: string;
  key_code: number;
  state_name: string;
  state_code: KeyState;
}

export enum ModifierKey {
  KEY_LEFTSHIFT = "KEY_LEFTSHIFT",
  KEY_RIGHTSHIFT = "KEY_RIGHTSHIFT",
  KEY_LEFTCTRL = "KEY_LEFTCTRL",
  KEY_RIGHTCTRL = "KEY_RIGHTCTRL",
  KEY_LEFTALT = "KEY_LEFTALT",
  KEY_RIGHTALT = "KEY_RIGHTALT",
  KEY_LEFTMETA = "KEY_LEFTMETA",
  KEY_RIGHTMETA = "KEY_RIGHTMETA",
}

export function parseKeyEvent(data: string): KeyEvent {
  return JSON.parse(data);
}

export function isShiftKey(evt: KeyEvent): boolean {
  return (
    evt.key_name === ModifierKey.KEY_LEFTSHIFT ||
    evt.key_name === ModifierKey.KEY_RIGHTSHIFT
  );
}

export function isCommandKey(evt: KeyEvent): boolean {
  return (
    evt.key_name === ModifierKey.KEY_LEFTMETA ||
    evt.key_name === ModifierKey.KEY_RIGHTMETA
  );
}

export function isAltKey(evt: KeyEvent): boolean {
  return (
    evt.key_name === ModifierKey.KEY_LEFTALT ||
    evt.key_name === ModifierKey.KEY_RIGHTALT
  );
}

export function isCtrlKey(evt: KeyEvent): boolean {
  return (
    evt.key_name === ModifierKey.KEY_LEFTCTRL ||
    evt.key_name === ModifierKey.KEY_RIGHTCTRL
  );
}
