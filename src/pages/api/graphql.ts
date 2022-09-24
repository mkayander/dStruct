// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let response: AxiosResponse | undefined;

    try {
        response = await axios({
            method: req.method,
            url: 'https://leetcode.com/graphql/',
            // headers: req.headers,
            data: req.body,
        });
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            response = e.response;
        }
    }

    if (!response) {
        res.status(500).json({ message: 'Failed to get a response' });
        return;
    }

    res.status(response.status).json(response.data);
}
