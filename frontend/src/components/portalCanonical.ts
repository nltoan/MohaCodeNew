export function portalCanonical(pathname: string) {
  return new URL(pathname || '/', 'https://moha.gov.vn').href;
}
