import type { ThanosMaskStrategy } from "#/shared/ui/effects/thanosDisintegrate/types";

export type MaskStrategyGrid = {
  grid: number[][];
  timeArray: number[];
};

export type MaskStrategyGenerator = (
  cols: number,
  rows: number,
) => MaskStrategyGrid;

const MASK_TIME_PRECISION = 50;

const quantizeMaskTime = (value: number): number =>
  Math.round(value * MASK_TIME_PRECISION) / MASK_TIME_PRECISION;

const buildTimeArray = (grid: number[][]): number[] => {
  const values = new Set<number>();
  for (const row of grid) {
    for (const cell of row) {
      values.add(cell);
    }
  }

  return Array.from(values).sort((left, right) => left - right);
};

const createGrid = (cols: number, rows: number): number[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

const leftToRightMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const colDenominator = Math.max(1, cols - 1);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime(col / colDenominator);
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const rightToLeftMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const colDenominator = Math.max(1, cols - 1);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime((cols - 1 - col) / colDenominator);
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const topToBottomMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const rowDenominator = Math.max(1, rows - 1);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime(row / rowDenominator);
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const bottomToTopMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const rowDenominator = Math.max(1, rows - 1);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime((rows - 1 - row) / rowDenominator);
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

type CornerDirection =
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom";

const createDiagonalMask =
  (corner: CornerDirection): MaskStrategyGenerator =>
  (cols, rows) => {
    const grid = createGrid(cols, rows);
    const diagonalDenominator = Math.max(1, cols + rows - 2);

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        let distance = 0;
        switch (corner) {
          case "left-top":
            distance = row + col;
            break;
          case "right-top":
            distance = row + (cols - 1 - col);
            break;
          case "left-bottom":
            distance = rows - 1 - row + col;
            break;
          case "right-bottom":
            distance = rows - 1 - row + (cols - 1 - col);
            break;
        }

        grid[row]![col] = quantizeMaskTime(distance / diagonalDenominator);
      }
    }

    return { grid, timeArray: buildTimeArray(grid) };
  };

const sandMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const values = new Set<number>();
  let waveOffset = 0;
  const waveStrideSeconds = 0.005;
  let sweepLeftToRight = true;

  for (let row = rows - 1; row >= 0; row -= 3) {
    for (let band = 0; band < 3 && row - band >= 0; band += 1) {
      for (let col = 0; col < cols; col += 1) {
        const sweepCol = sweepLeftToRight ? col : cols - 1 - col;
        const releaseTime = quantizeMaskTime(
          waveOffset + sweepCol * waveStrideSeconds,
        );
        grid[row - band]![col] = releaseTime;
        values.add(releaseTime);
      }
    }

    waveOffset += waveStrideSeconds * cols;
    sweepLeftToRight = !sweepLeftToRight;
  }

  return {
    grid,
    timeArray: Array.from(values).sort((left, right) => left - right),
  };
};

const centerOutMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const centerCol = cols / 2;
  const centerRow = rows / 2;
  const maxDistance = Math.hypot(centerCol, centerRow);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const distance = Math.hypot(col - centerCol, row - centerRow);
      grid[row]![col] = quantizeMaskTime(
        maxDistance === 0 ? 0 : distance / maxDistance,
      );
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const edgesInMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const centerCol = cols / 2;
  const centerRow = rows / 2;
  const maxDistance = Math.hypot(centerCol, centerRow);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const distance = Math.hypot(col - centerCol, row - centerRow);
      grid[row]![col] = quantizeMaskTime(
        maxDistance === 0 ? 0 : 1 - distance / maxDistance,
      );
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const splitHorizontalMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const centerRow = (rows - 1) / 2;
  const rowDenominator = Math.max(1, centerRow);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime(
        Math.abs(row - centerRow) / rowDenominator,
      );
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const splitVerticalMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);
  const centerCol = (cols - 1) / 2;
  const colDenominator = Math.max(1, centerCol);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime(
        Math.abs(col - centerCol) / colDenominator,
      );
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

const randomMask: MaskStrategyGenerator = (cols, rows) => {
  const grid = createGrid(cols, rows);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      grid[row]![col] = quantizeMaskTime(Math.random());
    }
  }

  return { grid, timeArray: buildTimeArray(grid) };
};

export const MASK_STRATEGY_GENERATORS: Record<
  Exclude<ThanosMaskStrategy, "wave">,
  MaskStrategyGenerator
> = {
  leftToRight: leftToRightMask,
  rightToLeft: rightToLeftMask,
  topToBottom: topToBottomMask,
  bottomToTop: bottomToTopMask,
  topLeftDiagonal: createDiagonalMask("left-top"),
  topRightDiagonal: createDiagonalMask("right-top"),
  bottomLeftDiagonal: createDiagonalMask("left-bottom"),
  bottomRightDiagonal: createDiagonalMask("right-bottom"),
  sand: sandMask,
  centerOut: centerOutMask,
  edgesIn: edgesInMask,
  splitHorizontal: splitHorizontalMask,
  splitVertical: splitVerticalMask,
  random: randomMask,
};

export const createMaskStrategyGrid = (
  strategy: Exclude<ThanosMaskStrategy, "wave">,
  cols: number,
  rows: number,
): MaskStrategyGrid => MASK_STRATEGY_GENERATORS[strategy](cols, rows);
