import lodash from 'lodash'
import {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'


const users = [
    { id: '1', firstName: 'Antoine', age: 57 },
    { id: '2', firstName: 'Karine', age: 55 },
]
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
})

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return lodash.find(users, { id: args.id })
            }
        },

    }
})

export default new GraphQLSchema({
    query: RootQueryType
})