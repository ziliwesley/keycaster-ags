import { Gio } from "astal";
import GioUnix from "gi://GioUnix?version=2.0";

/**
 * Creates a `Gio.DataInputStream` for reading data from the standard input (stdin).
 *
 * @returns {Gio.DataInputStream} A data input stream for reading stdin.
 */
export function getStdinDataStream(): Gio.DataInputStream {
  // Creates a Unix input stream from the standard input file descriptor (fd: 0).
  const stdin = new GioUnix.InputStream({ fd: 0 });

  const inputStream = new Gio.DataInputStream({
    base_stream: stdin,
    close_base_stream: true,
  });

  return inputStream;
}

/**
 * Reads lines asynchronously from a `Gio.DataInputStream` until the end of input or cancellation.
 *
 * @param {Gio.DataInputStream} dis - The data input stream to read from.
 * @param {(data: string) => void} callback - A callback function invoked with each line of data.
 * @returns {() => void} A function to cancel the reading process.
 */
export function readUntil(
  dis: Gio.DataInputStream,
  callback: (data: string) => void,
): () => void {
  let shouldContinue = true;
  const decoder = new TextDecoder("utf-8");

  /**
   * Cancels the reading process.
   */
  const cancel = () => {
    shouldContinue = false;
  };

  /**
   * Reads a line asynchronously and invokes the callback with the decoded data.
   * Continues reading until the end of input or cancellation.
   */
  const readAsync = () => {
    dis.read_line_async(0, null, (_, res) => {
      if (!shouldContinue) {
        return;
      }

      try {
        const [line] = dis.read_line_finish(res);
        if (line !== null) {
          console.debug("Received:", line);
          callback(decoder.decode(line)); // Call the callback with the received line
          readAsync(); // Continue reading the next line
        } else {
          console.log("End of input");
          dis.close(null);
        }
      } catch (e) {
        console.error("Error:", e.message);
      }
    });
  };

  readAsync(); // Start the first read

  return cancel;
}
