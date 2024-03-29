/**
 * The function `convertSecondsToTime` converts a given number of seconds into a formatted time string
 * in the format "HH:MM:SS".
 * @param {number} seconds - The `convertSecondsToTime` function takes a number of seconds as input and
 * converts it into a formatted time string in the format "HH:MM:SS".
 * @returns The function `convertSecondsToTime` returns a string in the format "HH:MM:SS" where HH
 * represents hours, MM represents minutes, and SS represents seconds.
 */
export function convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const hoursString = hours < 10 ? "0" + hours : hours.toString();
    const minutesString = minutes < 10 ? "0" + minutes : minutes.toString();
    const secondsString =
      remainingSeconds < 10
        ? "0" + remainingSeconds
        : remainingSeconds.toString();
  
    return `${hoursString}:${minutesString}:${secondsString}`;
  }
  