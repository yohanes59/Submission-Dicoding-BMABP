const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  // Client tidak melampirkan properti name pada request body.
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  // end no name

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  // end readPage > pageCount

  // Bila buku berhasil dimasukkan
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  // end berhasil

  // Server gagal memasukkan buku karena alasan umum (generic error).
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
  // end generic error
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  // query name
  if (name) {
    const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
    // end ?name
  } else if (reading) { /* query reading */
    const book = books.filter((book) => Number(book.reading) === Number(reading))
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
    // end ?reading
  } else if (finished) { /* query finished */
    const book = books.filter((book) => Number(book.finished) === Number(finished))
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
    // end ?finished
  } else {
    // menampilkan seluruh buku yang disimpan
    const response = h.response({
      status: "success",
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }
  // end tampil
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((n) => n.id === bookId)[0]

  // Bila buku dengan id yang dilampirkan ditemukan
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  // end id ditemukan

  // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
  // end id tidak ditemukan
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  // Client tidak melampirkan properti name pada request body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  // end name kosong

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  // end readPage > pageCount

  // Bila buku berhasil diperbarui
  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  // end berhasil

  // Id yang dilampirkan oleh client tidak ditemukkan oleh server
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
  // end Id tidak ada
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  // Bila id dimiliki oleh salah satu buku, maka buku tersebut harus dihapus
  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  // end id ada, hapus!

  // Bila id yang dilampirkan tidak dimiliki oleh buku manapun
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
  // end id tidak ada
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }