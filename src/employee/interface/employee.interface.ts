import {Document} from 'mongoose'

export interface Employee extends Document {
  _id: string
  lastName: string
  firstName: string
  title: string
  reportsTo: Employee[],
  employees: Employee[],
  birthDate: Date
  hireDate: Date
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  fax: string
  email: string
  createdAt: Date
  fullName: string

}