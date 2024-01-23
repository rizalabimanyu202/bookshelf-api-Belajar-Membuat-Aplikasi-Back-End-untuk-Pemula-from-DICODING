const { nanoid } = require('nanoid');
const buku = require('./buku');
let response = require('./response');

let cekNama;
let cekBaca;
let hapusEdit;

const tambahBukuHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  
  cekNama = name === '' || typeof name === 'undefined';
  cekBaca = readPage > pageCount;

  const tampunganBukuBaru = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (cekNama) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (cekBaca) {
    response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  
  buku.push(tampunganBukuBaru);

  const isSuccess = buku.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const tampilBukuHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let buku2 = buku;
  if (typeof name !== 'undefined') {
    const nameKecil = name.toLowerCase();
    buku2 = buku.filter((book) => book.name.toLowerCase().includes(nameKecil));
  }
  if (Number(reading) === 0) {
    buku2 = buku.filter((book) => Number(book.reading) === 0);
  }
  if (Number(reading) === 1) {
    buku2 = buku.filter((book) => Number(book.reading) === 1);
  }
  if (Number(finished) === 0) {
    buku2 = buku.filter((book) => Number(book.finished) === 0);
  }
  if (Number(finished) === 1) {
    buku2 = buku.filter((book) => Number(book.finished) === 1);
  }
  
  response = h.response({
    status: 'success',
    data: {
      books: buku2.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher, })),
    },
  });
  response.code(200);
  return response;
};

const tampilDetailHandler = (request, h) => {
  const { bookId } = request.params;
  const bukuDetail = buku.filter((n) => n.id === bookId)[0];
  const cekBuku = typeof bukuDetail !== 'undefined';

  if (cekBuku) {
    response = h.response({
      status: 'success',
      data: {
        book: bukuDetail,
      },
    });
    response.code(200);
    return response;
  }
  response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBukuHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = buku.findIndex((note) => note.id === bookId);
  cekNama = name === '' || typeof name === 'undefined';
  cekBaca = readPage > pageCount;
  hapusEdit = index !== -1;

  if (cekNama) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (cekBaca) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    buku[index] = {
      ...buku[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }
  response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const hapusBukuHandler = (request, h) => {
  const { bookId } = request.params;
  const index = buku.findIndex((note) => note.id === bookId);
  hapusEdit = index !== -1;

  if (hapusEdit) {
    buku.splice(index, 1);
    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  tambahBukuHandler,
  tampilBukuHandler,
  tampilDetailHandler,
  editBukuHandler,
  hapusBukuHandler,
};
