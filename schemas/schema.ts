import lodash from 'lodash'
import jsonserver from '../api/jsonserver'

import {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql'


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/companies/${parentValue.companyId}`)
                    return response.data
                } catch (e) {
                    console.log(e)
                    return {}
                }
            }
        }
    }
})

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/users/${args.id}`)
                    return response.data
                } catch (e) {
                    console.log(e)
                    return {}
                }
            }
        },

    }
})

export default new GraphQLSchema({
    query: RootQueryType
})