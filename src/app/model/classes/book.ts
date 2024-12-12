export class Book{
    id:number
    name:string
    author:string
    description:string
    price:number
    quantity:number
    bookLogo:string

    constructor(){
        this.id=0,
        this.name='',
        this.author='',
        this.description='',
        this.price=0,
        this.quantity=0,
        this.bookLogo=''
    }
}