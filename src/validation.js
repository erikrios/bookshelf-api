const validateName = (name) => {
  if (!name) {
    return {
      error: {
        message: 'Mohon isi nama buku',
      },
    };
  }
  return {};
};

const validateReadStatus = (readPage, pageCount) => {
  if (readPage > pageCount) {
    return {
      error: {
        message: 'readPage tidak boleh lebih besar dari pageCount',
      },
    };
  }
  return {};
};

module.exports = { validateName, validateReadStatus };
