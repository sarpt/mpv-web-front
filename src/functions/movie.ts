export function getMovieName(path: string): string {
  const pathParts = path.split('/');

  return pathParts[pathParts.length - 1];
}
