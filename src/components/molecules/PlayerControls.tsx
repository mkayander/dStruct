import {
  FirstPage,
  LastPage,
  Pause,
  PlayArrow,
  Speed,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Input,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

import { FrameIndexLabel } from "#/components/atoms/FrameIndexLabel";
import { useI18nContext } from "#/hooks";
import { useAppSelector } from "#/store/hooks";
import {
  selectCallstackIsPlaying,
  selectCallstackLength,
  selectIsLastFrame,
  selectIsRootFrame,
} from "#/store/reducers/callstackReducer";

export type PlayerControlsProps = {
  sliderValue: number;
  setSliderValue: (value: number) => void;
  handleStepBack: () => void;
  handlePlay: () => void;
  handleStepForward: () => void;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  sliderValue,
  setSliderValue,
  handleStepBack,
  handlePlay,
  handleStepForward,
}) => {
  const { LL } = useI18nContext();
  const callstackLength = useAppSelector(selectCallstackLength);
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const isRootFrame = useAppSelector(selectIsRootFrame);
  const isLastFrame = useAppSelector(selectIsLastFrame);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const handleBlur = () => {
    if (sliderValue < 1) {
      setSliderValue(1);
    } else if (sliderValue > 700) {
      setSliderValue(700);
    }
  };

  return (
    <Stack p={2} direction="row" alignItems="center" spacing={2}>
      <Box sx={{ maxWidth: 600, flexGrow: 1 }}>
        <Typography id="input-slider" variant="caption" gutterBottom>
          {LL.PLAYBACK_INTERVAL()}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Speed />
          </Grid>
          <Grid item xs>
            <Slider
              value={sliderValue}
              min={1}
              max={700}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              value={sliderValue}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              renderSuffix={() => (
                <Typography variant="caption">{LL.MS()}</Typography>
              )}
              inputProps={{
                step: 5,
                min: 1,
                max: 700,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
              sx={{ width: "64px" }}
            />
          </Grid>
        </Grid>
      </Box>
      <FrameIndexLabel />
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton
          title="Step back"
          disabled={!callstackLength || isRootFrame}
          onClick={handleStepBack}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          title={isPlaying ? "Pause" : "Play"}
          disabled={!callstackLength || isLastFrame}
          onClick={handlePlay}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          title="Step forward"
          disabled={!callstackLength || isLastFrame}
          onClick={handleStepForward}
        >
          <LastPage />
        </IconButton>
      </Stack>
    </Stack>
  );
};