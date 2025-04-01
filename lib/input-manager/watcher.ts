import { subprocess } from "astal";

export function spawnKeyInputWatcher(handler: (data: string) => void) {
  const proc = subprocess(
    "showmethekey-cli",
    // Disable subprocess stdout
    () => {},
  );

  proc.connect("stdout", (_, out) => {
    // console.log("stdout", out.toString());

    handler(out.toString());
  });

  proc.connect("stderr", (_, err) => {
    console.error("stderr", err.toString());
  });
}
