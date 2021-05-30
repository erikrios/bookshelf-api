const validateName = (name) => {
  if (!name) {
    return {
      error: {
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    };
  }
  return null;
};

const validateReadStatus = (readPage, pageCount) => {
  if (readPage > pageCount) {
    return {
      error: {
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    };
  }
  return null;
};

module.exports = { validateName, validateReadStatus };
