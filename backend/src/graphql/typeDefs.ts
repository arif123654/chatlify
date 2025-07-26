import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Message {
    id: ID!
    user: String!
    content: String!
    timestamp: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    createMessage(user: String!, content: String!): Message!
  }

  type Subscription {
    messageCreated: Message!
  }
`;

export default typeDefs;