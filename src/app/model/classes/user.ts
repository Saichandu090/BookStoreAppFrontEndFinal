export class LoggedInUser{
    email:string;
    role:string;

    constructor(){
        this.email=''
        this.role=''
    }
}


export class UserRegister{
    firstName:string
    lastName:string
    dob:string
    password:string
    email:string
    role:string

    constructor(){
        this.firstName='',
        this.lastName='',
        this.dob='',
        this.password='',
        this.email='',
        this.role=''
    }
}

export class UserEdit{
    firstName:string
    lastName:string
    dob:string
    email:string

    constructor(){
        this.firstName='',
        this.lastName='',
        this.dob='',
        this.email=''
    }
}

