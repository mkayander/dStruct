import {
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import React, { useMemo } from "react";

import type { QuestionDataQuery } from "#/graphql/generated";

import { ProgressBar } from "./ProgressBar";
import { RateButton } from "./RateButton";

interface RatingButtonsProps {
  question: QuestionDataQuery["question"];
  onLike?: () => void;
  onDislike?: () => void;
}

export const RatingButtons: React.FC<RatingButtonsProps> = ({
  question,
  onLike,
  onDislike,
}) => {
  const likesPercentage = useMemo(
    () => (question.likes / (question.likes + question.dislikes)) * 100,
    [question.dislikes, question.likes],
  );

  return (
    <div className="relative">
      <div className="inline-flex rounded-md">
        <RateButton
          variant="left"
          icon={
            question.isLiked ? (
              <ThumbUp fontSize="small" />
            ) : (
              <ThumbUpOutlined fontSize="small" />
            )
          }
          count={question.likes}
          onClick={onLike}
          aria-label="Like"
        />
        <RateButton
          variant="right"
          icon={
            question.isLiked === false ? (
              <ThumbDown fontSize="small" />
            ) : (
              <ThumbDownOutlined fontSize="small" />
            )
          }
          count={question.dislikes}
          onClick={onDislike}
          aria-label="Dislike"
        />
      </div>

      <ProgressBar value={likesPercentage} className="mt-1" />
    </div>
  );
};
