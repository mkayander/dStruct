import { setCookie } from 'cookies-next';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { apolloClient } from '#/graphql/apolloClient';
import type {
  GetUserProfileQueryResult,
  GetUserProfileQueryVariables,
} from '#/graphql/generated';
import { GetUserProfileDocument } from '#/graphql/generated';
import { getServerAuthSession } from '#/server/common/get-server-auth-session';
import { prisma } from '#/server/db/client';

const checkDailyProblem = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { extToken } = req.cookies;
  const body = JSON.parse(req.body);

  const session = await getServerAuthSession({ req, res });
  console.log('session', session);

  if (!('username' in body)) {
    res.status(400).json({ error: 'username not provided' });
    return;
  }

  const leetCodeUser = await prisma.leetCodeUser.findFirstOrThrow({
    where: {
      user: {
        name: body.username,
      },
    },
  });

  setCookie('LEETCODE_SESSION', leetCodeUser.token, {
    req,
  });

  const response = await apolloClient.query<
    GetUserProfileQueryResult,
    GetUserProfileQueryVariables
  >({
    query: GetUserProfileDocument,
    variables: {
      username: body.username,
    },
  });

  let status = 200;
  if (response.errors) {
    status = 400;
  }

  res.status(status).json(response);
};

export default checkDailyProblem;
