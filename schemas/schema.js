import lodash from 'lodash';
import jsonserver from '../api/jsonserver';

import {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';


const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        users: {
            type: GraphQLList(UserType),
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/companies/${parentValue.id}/users`);
                    return response.data;
                } catch (e) {
                    console.log(e);
                    return {};
                }
            }
        },

    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/companies/${parentValue.companyId}`);
                    return response.data;
                } catch (e) {
                    console.log(e);
                    return {};
                }
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/users/${args.id}`);
                    return response.data;
                } catch (e) {
                    console.log(e);
                    return {};
                }
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve: async (parentValue, args) => {
                try {
                    const response = await jsonserver.get(`/companies/${args.id}`);
                    return response.data;
                } catch (e) {
                    console.log(e);
                    return {};
                }
            }
        }
    })
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, args) {
                // ici j'utilise la syntaxe des "promises" plutôt que async/await, mais ça revient au même
                return jsonserver.post(`http://localhost:3000/users`, {
                    firstName: args.firstName,
                    age: args.age, companyId: args.companyId,
                }).then((response) => {
                    return response.data;
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        deleteUser: {
            type: UserType, // en fait, le DELETE ne renvoie pas de user
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, args) {
                // ici j'utilise la syntaxe des "promises" plutôt que async/await, mais ça revient au même
                return jsonserver.delete(`http://localhost:3000/users/${args.id}`).then((response) => {
                    return response.data;
                }).catch((e) => {
                    console.log(e);
                });
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQueryType,
    mutation: MutationType
});