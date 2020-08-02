export function secondsToHHMMSS(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);

  const time = date.toISOString().substr(11, 8);
  return seconds < 3600 ? time.slice(3) : time ;
}
