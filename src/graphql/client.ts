import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getCookie, setCookie } from 'cookies-next';

const httpLink = createHttpLink({
    uri: '/api/graphql',
});

const testCookie = '';

setCookie('LEETCODE_SESSION', testCookie);

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getCookie('LEETCODE_SESSION');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            extToken: token,
        },
    };
});

const jsonParseRead = (field: string) => JSON.parse(field);

const cache = new InMemoryCache({
    typePolicies: {
        QuestionNode: {
            fields: {
                stats: {
                    read: jsonParseRead,
                },
                similarQuestions: {
                    read: jsonParseRead,
                },
                envInfo: {
                    read: jsonParseRead,
                },
                metaData: {
                    read: jsonParseRead,
                },
            },
        },
    },
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
});
