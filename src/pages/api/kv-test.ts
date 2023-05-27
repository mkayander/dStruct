import { kv } from "@vercel/kv";
import type { NextApiRequest, NextApiResponse } from "next";

type TestNum = {
  id: string;
  number: number;
};

const kvTest = async (req: NextApiRequest, res: NextApiResponse) => {
  let data = await kv.get<TestNum>("test-num");
  if (!data) {
    data = { id: "test-num", number: 0 };
  }

  data.number++;

  await kv.set<TestNum>("test-num", data);

  res.status(200).json({ data });
};

export default kvTest;
