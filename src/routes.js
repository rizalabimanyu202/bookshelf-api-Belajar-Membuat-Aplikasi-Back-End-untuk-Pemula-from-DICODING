const {
  tambahBukuHandler,
  tampilBukuHandler,
  tampilDetailHandler,
  editBukuHandler,
  hapusBukuHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: tambahBukuHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: tampilBukuHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: tampilDetailHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBukuHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: hapusBukuHandler,
  },
];

module.exports = routes;
