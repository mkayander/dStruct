import { AllInclusive, Psychology } from "@mui/icons-material";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

import { useProjectBrowserContext } from "./ProjectBrowserContext";

type Topic = "all" | "algorithms";

type TopicConfig = {
  id: Topic;
  label: string;
  icon: React.ReactElement;
};

const TOPICS: TopicConfig[] = [
  {
    id: "all",
    label: "All Topics",
    icon: <AllInclusive fontSize="small" />,
  },
  {
    id: "algorithms",
    label: "Algorithms",
    icon: <Psychology fontSize="small" />,
  },
];

export const ProjectBrowserTopicFilters: React.FC = () => {
  const { setSelectedCategories } = useProjectBrowserContext();

  // For now, "All Topics" is always selected since we don't have topic filtering yet
  // This is a placeholder for future topic-based filtering
  const selectedTopic: Topic = "all";

  const handleTopicChange = (
    _ev: React.MouseEvent<HTMLElement>,
    newTopic: Topic | null,
  ) => {
    if (newTopic === null) {
      // Don't allow deselecting all topics
      return;
    }

    // For now, topic filtering is not implemented in the data model
    // This will be extended when topic field is added to projects
    // For now, selecting a topic clears category filters (placeholder behavior)
    if (newTopic === "all") {
      setSelectedCategories([]);
    }
    // Other topics will filter categories when topic filtering is implemented
  };

  return (
    <Box
      sx={{
        p: 1.5,
        borderBottom: 1,
        borderColor: "divider",
        overflowX: "auto",
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 3,
        },
      }}
      role="region"
      aria-label="Topic filters"
    >
      <ToggleButtonGroup
        value={selectedTopic}
        exclusive
        onChange={handleTopicChange}
        aria-label="Topic filter selection"
        sx={{
          display: "flex",
          gap: 0.5,
          flexWrap: "nowrap",
          "& .MuiToggleButton-root": {
            border: 1,
            borderColor: "divider",
            px: 1.5,
            py: 0.75,
            textTransform: "none",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          },
        }}
      >
        {TOPICS.map((topic) => (
          <ToggleButton
            key={topic.id}
            value={topic.id}
            aria-label={`Filter by ${topic.label}`}
            aria-pressed={selectedTopic === topic.id}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              {topic.icon}
              <Box component="span" sx={{ whiteSpace: "nowrap" }}>
                {topic.label}
              </Box>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
