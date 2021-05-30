const { nanoid } = require('nanoid');
const books = require('./books');
const { validateName, validateReadStatus } = require('./validation');

const addBookHandler = (request, h) => {
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

  const { error: nameValidationError } = validateName(name);
  if (nameValidationError) {
    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${nameValidationError.message}`,
    });
    response.code(400);
    return response;
  }

  const { error: readStatusValidationError } = validateReadStatus(readPage, pageCount);
  if (readStatusValidationError) {
    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${readStatusValidationError.message}`,
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
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

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name: nameQuery, reading: readingQuery, finished: finishedQuery } = request.query;

  let availableBooks = books;

  if (nameQuery !== undefined) {
    availableBooks = availableBooks.filter((book) => {
      const name = book.name.toLowerCase();
      return name.includes(nameQuery.toLowerCase());
    });
  }

  if (readingQuery !== undefined) {
    availableBooks = availableBooks.filter((book) => {
      if (Number(readingQuery) === 0) {
        return book.reading === false;
      }
      if (Number(readingQuery) === 1) {
        return book.reading === true;
      }
      return book;
    });
  }

  if (finishedQuery !== undefined) {
    availableBooks = availableBooks.filter((book) => {
      if (Number(finishedQuery) === 0) {
        return book.finished === false;
      }
      if (Number(finishedQuery) === 1) {
        return book.finished === true;
      }
      return book;
    });
  }

  return {
    status: 'success',
    data: {
      books: availableBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

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

  const { error: nameValidationError } = validateName(name);
  if (nameValidationError) {
    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${nameValidationError.message}`,
    });
    response.code(400);
    return response;
  }

  const { error: readStatusValidationError } = validateReadStatus(readPage, pageCount);
  if (readStatusValidationError) {
    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${readStatusValidationError.message}`,
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
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

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
