import { DatePipe } from "@angular/common"

export interface IUserRegister{
    firstName:string,
    lastName:string,
    dateOfBirth:DatePipe,
    password:string,
    email:string,
    role:string
}

export interface ILogin{
    emailId:string,
    password:string
}