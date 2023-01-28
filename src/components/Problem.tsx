import type { Problem } from "@prisma/client";
import React from "react";

export type ProblemProps = {
  data: Problem;
};

export const ProblemCard: React.FC<ProblemProps> = ({ data }) => {
  return (
    <div>
      <h4>Problem</h4>
      <span>{data.id}</span>
      <span>{data.title}</span>
      <span>{data.solved}</span>
      <span>{JSON.stringify(data, null, 2)}</span>
    </div>
  );
};
