// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { serialize, parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let response: AxiosResponse | undefined;

    const token = req.headers.cookie && parse(req.headers.cookie)['LEETCODE_SESSION'];

    try {
        response = await axios({
            method: req.method,
            url: 'https://leetcode.com/graphql/',
            // headers: req.headers,
            headers: {
                cookie: (token && serialize('LEETCODE_SESSION', token)) || '',
            },
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
