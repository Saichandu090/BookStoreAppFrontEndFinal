export class Book {
  bookId: number
  bookName: string
  bookAuthor: string
  bookDescription: string
  bookPrice: number
  bookQuantity: number
  bookLogo: string

  constructor() {
    this.bookId = 0,
      this.bookName = '',
      this.bookAuthor = '',
      this.bookDescription = '',
      this.bookPrice = 0,
      this.bookQuantity = 0,
      this.bookLogo = ''
  }
}


export class BookRequest {
  bookName: string
  bookAuthor: string
  bookDescription: string
  bookPrice: number
  bookQuantity: number
  bookLogo: string

  constructor() {
      this.bookName = '',
      this.bookAuthor = '',
      this.bookDescription = '',
      this.bookPrice = 0,
      this.bookQuantity = 0,
      this.bookLogo = ''
  }
}
