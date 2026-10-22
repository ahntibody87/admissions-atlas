(() => {
 'use strict';
 const routes = { archive: '../archive/', simulation: '../simulation/', analysis: '../analysis/', 'grade-planning': '../grades/' };
 function redirect() {
  const route = routes[location.hash.slice(1)];
  if (route) location.replace(route + location.search);
 }
 redirect();
 addEventListener('hashchange', redirect);
})();
