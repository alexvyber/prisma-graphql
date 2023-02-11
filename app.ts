require("dotenv").config()
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { PrismaClient } from "@prisma/client"

const { random } = Math

const app = express()
const port = 3000
const prisma = new PrismaClient()

const typeDefs = `
  type File {
    id: String!
    name: String!
    directoryId: String!
    createdAt: String!
    updatedAt: String!
    versions: [FileVersion]!
  }

  type FileVersion {
    id: String!
    name: String!
    fileId: String!
    mimeType: String!
    size: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Directory {
    id: String!
    name: String!
    parentId: String
    createdAt: String!
    updatedAt: String!
    files: [File]!
    directories: [Directory]!
  }

  type Query {
    getAllFiles: [File]!
    getAllFileVersions: [FileVersion]!
    getAllDirectories: [Directory]!
    someShit: [String]!
  }
`

const resolvers = {
  Query: {
    getAllFiles: () => prisma.file.findMany(),
    getAllFileVersions: () => prisma.fileVersion.findMany(),
    getAllDirectories: () => prisma.directory.findMany(),
    someShit: () => (random() > 0.5 ? ["some", "shit"] : ["other", "shit"]),
  },
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
)

app.listen(port, () => {
  console.log(`Application running on port ${port}.`)
})
