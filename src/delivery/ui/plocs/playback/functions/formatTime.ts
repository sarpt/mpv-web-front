export function secondsToHHMMSS(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);

  const time = date.toISOString().substring(11, 19);

  return seconds < 3600 ? time.slice(3) : time;
}
