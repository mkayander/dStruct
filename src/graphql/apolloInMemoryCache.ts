import { InMemoryCache } from "@apollo/client";

const jsonParseRead = (field: string) => JSON.parse(field);

export const createApolloInMemoryCache = (): InMemoryCache =>
  new InMemoryCache({
    typePolicies: {
      QuestionNode: {
        fields: {
          stats: {
            read: (stats: string) => {
              const result = jsonParseRead(stats);
              result.acRate = parseFloat(result.acRate);
              return result;
            },
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
