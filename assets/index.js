const wrapper = document.querySelector("#books-wrapper")
const shoppingCart = document.querySelector("#shopping-cart")
let listBooks = []
let cartList = JSON.parse(localStorage.getItem("shoppingCart")) || []

window.addEventListener("DOMContentLoaded", async () => {
  await loadBooks()
  loadCart()
})
const loadBooks = async () => {
  try {
    const response = await fetch("https://striveschool-api.herokuapp.com/books");
    const books = await response.json()
    listBooks = books
    showBooks(books)
  } catch (error) {
    console.error(error.message)
  }
}

const showBooks = (books) => {
  wrapper.innerHTML = ""
  books.forEach((book) => {
    const isBookInCart = cartList.some((cartBook) => cartBook.title === book.title)
    const singleBook = document.createElement("div")
    singleBook.classList.add("col")
    singleBook.innerHTML = `
      <div class="card shadow-sm h-100 ${isBookInCart ? 'selected' : ''}">
        <img src="${book.img}" class="img-fluid card-img-top" alt="${book.title}">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text badge rounded-pill bg-dark mb-2">${book.category}</p>
          <p class="fs-4">${book.price}€</p>
          <div>
            <button class="btn btn-danger" onclick="addToCart(event, '${book.asin}')">Compra</button>
            <button class="btn btn-outline-danger" id="nascondi" onclick="skipMe(event)">Nascondi</button>
          </div>
        </div>
      </div>
    `
    wrapper.appendChild(singleBook)
  })
}

const loadCart = () => {
  shoppingCart.innerHTML = "<h3>Carrello</h3>"
  cartList.forEach((book) => {
    const shoppingItem = document.createElement("div")
    shoppingItem.classList.add("shopping-item")
    shoppingItem.innerHTML = `
      <div class="d-flex align-items-start gap-2">
        <img src=${book.img} class="img-fluid" width="60" />
        <div class="flex-grow-1">
          <p class="mb-2">${book.title}</p>
          <div class="d-flex justify-content-between">
            <p class="fw-bold">${book.price}€</p>
            <div>
              <div>
                <button class="btn btn-danger" onclick="deleteItem('${book.asin}')">Elimina </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    shoppingCart.appendChild(shoppingItem)
  })
}

const skipMe = (event) => {
  event.target.closest('.col').remove()
}

const addToCart = (event, asin) => {
  const book = listBooks.find((book) => book.asin === asin)
  cartList.push(book)
  localStorage.setItem("shoppingCart", JSON.stringify(cartList))
  loadCart()
  event.target.closest(".card").classList.add("selected")
}

const deleteItem = (asin) => {
  const index = cartList.findIndex((book) => book.asin === asin)
  if (index !== -1) {
    cartList.splice(index, 1)
    localStorage.setItem("shoppingCart", JSON.stringify(cartList))
  }
  loadCart()
}
