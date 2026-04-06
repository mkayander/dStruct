import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Replay from "@mui/icons-material/Replay";
import Speed from "@mui/icons-material/Speed";
import {
  Box,
  Grid,
  IconButton,
  Input,
  Slider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  selectCallstackIsPlaying,
  selectCallstackLength,
  selectIsLastFrame,
  selectIsRootFrame,
} from "#/features/callstack/model/callstackSlice";
import { useI18nContext } from "#/shared/hooks";
import { FrameIndexLabel } from "#/shared/ui/atoms/FrameIndexLabel";
import { iconButtonHoverSx } from "#/shared/ui/styles/iconButtonHoverStyles";
import { useAppSelector } from "#/store/hooks";

export type PlayerControlsProps = {
  disabled?: boolean;
  sliderValue: number;
  setSliderValue: (value: number) => void;
  handleStepBack: () => void;
  handlePlay: () => void;
  handleReplay: () => void;
  handleStepForward: () => void;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  disabled,
  sliderValue,
  setSliderValue,
  handleStepBack,
  handlePlay,
  handleReplay,
  handleStepForward,
}) => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const callstackLength = useAppSelector(selectCallstackLength);
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const isRootFrame = useAppSelector(selectIsRootFrame);
  const isLastFrame = useAppSelector(selectIsLastFrame);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    if (!Number.isFinite(parsed)) {
      return;
    }
    setSliderValue(parsed);
  };

  const handleBlur = () => {
    const clamped = Math.min(700, Math.max(1, sliderValue));
    if (sliderValue !== clamped) {
      setSliderValue(clamped);
    }
  };

  const canReplay = Boolean(callstackLength && !isPlaying && isLastFrame);

  return (
    <Stack
      py={1}
      px={2}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      spacing={1}
      onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}
    >
      <Box width="100%">
        <Typography id="input-slider" variant="caption" gutterBottom>
          {LL.PLAYBACK_INTERVAL()}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Speed />
          </Grid>
          <Grid size="grow">
            <Slider
              disabled={disabled}
              value={sliderValue}
              min={1}
              max={700}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid>
            <Input
              disabled={disabled}
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
      <Stack
        position="relative"
        direction="row"
        alignItems="center"
        spacing={0.5}
      >
        <IconButton
          title="Step back"
          disabled={disabled || !callstackLength || isRootFrame}
          onClick={handleStepBack}
          sx={iconButtonHoverSx(theme)}
        >
          <FirstPage />
        </IconButton>
        <Box
          sx={{
            position: "absolute",
            bottom: -1,
            left: "47%",
            transform: "translate(-50%, 50%)",
          }}
        >
          <FrameIndexLabel />
        </Box>
        <IconButton
          title={canReplay ? "Replay" : isPlaying ? "Pause" : "Play"}
          disabled={!callstackLength}
          onClick={canReplay ? handleReplay : handlePlay}
          sx={iconButtonHoverSx(theme)}
        >
          {canReplay ? <Replay /> : isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          title="Step forward"
          disabled={disabled || !callstackLength || isLastFrame}
          onClick={handleStepForward}
          sx={iconButtonHoverSx(theme)}
        >
          <LastPage />
        </IconButton>
      </Stack>
    </Stack>
  );
};
