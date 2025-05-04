import React from "react";

import type { TopicTag as Topic } from "#/graphql/generated";
import { Badge } from "#/shadcn/ui/badge";
import { Skeleton } from "#/shadcn/ui/skeleton";
import { getTagGradient } from "#/shared/lib/tagColors";

interface TopicTagProps {
  topic: Partial<Topic>;
}

export const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
  const handleClick = () => {
    // console.log(topic.slug);
  };

  return (
    <Badge
      variant="secondary"
      className="relative cursor-pointer overflow-hidden rounded-full border-0 px-3 py-1.5 font-bold tracking-wider"
      style={{
        background: getTagGradient(topic.slug),
        color: "white",
      }}
      onClick={handleClick}
    >
      {topic.name}
    </Badge>
  );
};

export const TopicTagSkeleton: React.FC = () => {
  return <Skeleton className="h-7 w-[12%] rounded-md" />;
};
