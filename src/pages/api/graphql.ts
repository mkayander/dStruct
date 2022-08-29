// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await axios({
        method: req.method,
        url: 'https://leetcode.com/graphql/',
        // headers: req.headers,
        data: req.body,
    });

    console.log(response);

    res.status(200).json(response.data);
}
