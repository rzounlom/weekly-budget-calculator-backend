import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    #User quries
    loginUser(data: LoginUserInput): Token
    findUsers(query: String): [User]!
    findUserById(id: ID!): User

    #Employee quries
    findEmployees(query: String): [Employee]!
    findEmployeeById(id: ID!): Employee
  }

  type Mutation {
    #User mutations
    createUser(data: CreatUserInput): User!
    updateUser(data: UpdateUserInput): User!
    deleteUser(id: ID!): Message!

    #Employee mutations
    createEmployee(data: CreatEmployeeInput): Employee!
    updateEmployee(employeeId: Int!, data: UpdateEmplyeeInput): Employee!
    deleteEmployee(employeeId: Int!): Message!

    # Shift mutations
    createShift(data: CreateShiftInput): Shift
    updateShift(data: UpdateShiftInput): Shift
    deleteSingleShift(data: DeleteShiftInput): Message!
    deleteShiftsByDay(day: String!): Message!
  }

  # USER Type
  type User {
    id: ID!
    username: String!
    role: UserRole
  }

  type Token {
    token: String
  }

  input CreatUserInput {
    username: String!
    password: String!
    role: String
  }

  input UpdateUserInput {
    id: ID!
    username: String
    password: String
    role: String
  }

  input LoginUserInput {
    username: String!
    password: String!
  }

  enum UserRole {
    USER
    ADMIN
  }

  # EMPLOYEE Type
  type Employee {
    id: ID!
    employeeId: Int!
    firstName: String!
    lastName: String!
    position: String!
    rate: Float!
  }

  input CreatEmployeeInput {
    employeeId: Int!
    firstName: String!
    lastName: String!
    position: String!
    rate: Float!
  }

  input UpdateEmplyeeInput {
    firstName: String
    lastName: String
    position: String
    rate: Int
  }

  # SHIFT Type
  type Shift {
    day: String!
    employee: Employee!
    hours: Int!
  }

  input DeleteShiftInput {
    employeeId: Int!
    day: String!
  }

  input CreateShiftInput {
    day: String!
    employeeId: Int!
    hours: Int!
  }

  input UpdateShiftInput {
    employeeId: Int!
    day: String!
    hours: Int!
  }

  type Day {
    day: String!
    shifts: [Shift]!
  }

  #  Message Type
  type Message {
    message: String!
  }
`;

export default typeDefs;
