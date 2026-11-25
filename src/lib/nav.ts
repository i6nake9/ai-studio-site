/**
 * Address for a menu item. Section links ("#prices") scroll on the home page
 * and lead back to it from other pages; page links ("/blog/") stay as they are.
 */
export function navHref(href: string, home: boolean): string {
  if (!href.startsWith("#")) return href;
  return home ? href : `/${href}`;
}
