express : http server
process users http request and responsed

user ---> Request to ----> 
express -----> Request asking for graphql? yes ---> graphQL  ---> response
                                           no ----> response


``` 
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
  })
);

app.listen(4100, () => {
    console.log('Listening');
});
```

any request that starts with /graphql will be handled by graphqlHTTP

graphiql: true is one of graphQL middleWare option, enable web-based GraphQL IDE (interactive query tool). (enable in dev env).

schema must contain in option

schema: contains all the knowledge required for telling GraphQL what ur applications's data looks like. --- what property each object has, how each objects related to each other.

------------------------------------------------------------------

in schema.js
```
import graphql, { GraphQLInt, GraphQLString } from 'graphql';

const { 
    GraphQLObjectType
} = graphql;

// define a UserType
const UserType = new GraphQLObjectType({
// name we call this type
  name: "User",
// properties this type contains
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});```

---------------------------------------------------------------------
Root query: entry point of the data.

means: You ask Rootquery about user with id, 
        return a user to you.

``` 
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            // return type
            type: UserType,
            // ask query with this id
            args: { id: { type: GraphQLString }},
            // resolve function goes to database and search with args
            resolve(parentValue, args) {

            }
        } 
    }
})
```
---------------------------------------------------------------------
in schema.js export schema.

const schema = new GraphQLSchema({ query: RootQuery });
export default schema;

