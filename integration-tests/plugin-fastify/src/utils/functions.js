export function isGatsbyHosting(response) {
  return response.setHeader !== undefined;
}
