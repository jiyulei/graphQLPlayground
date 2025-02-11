import graphql, { GraphQLInt, GraphQLString } from 'graphql';
import axios from 'axios';

const { 
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users : { 
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
        type: CompanyType,
        resolve(parentValue, args) {
            return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then(res => res.data);
        }
    }
  })
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLString)},
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age}) {
        return axios
          .post(`http://localhost:3000/users`, { firstName, age })
          .then((res) => res.data);
      }
    },
    deleteUser: {
        type: UserType,
        args: {
            userId: { type: new GraphQLNonNull(GraphQLString)},
        },
        resolve(parentValue, { userId }) {
            return axios.delete(`http://localhost:3000/users/${userId}`)
            .then(res => res.data);
        }
    }
  },
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString }},
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(res => res.data);
            }
        }
    }
})

const schema = new GraphQLSchema({ query: RootQuery, mutation });
export default schema;

// axios.post(`http://localhost:3000/companies`, {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ id: "3", name: "meta", description: "facebook"});
// })