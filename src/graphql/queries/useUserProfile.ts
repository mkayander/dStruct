import { gql, request } from 'graphql-request';
import { useQuery } from '@tanstack/react-query';

const query = gql`
    query getUserProfile($username: String!) {
        allQuestionsCount {
            difficulty
            count
        }
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
            profile {
                ranking
                reputation
                starRating
                userAvatar
            }
        }
    }
`;

const requestHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true',
};

export const useUserProfile = (username: string) =>
    useQuery(['userProfile'], async () => request('/api/graphql', query, { username }, requestHeaders), {
        enabled: false,
    });
