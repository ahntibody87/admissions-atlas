// Preserve existing bookmarks, query strings and section links.
location.replace(new URL('grades/' + location.search + location.hash, location.href).href);
