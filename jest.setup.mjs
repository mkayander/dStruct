// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

// Mock env variables
process.env.NEXT_PUBLIC_BUCKET_BASE_URL = "https://leetpal.s3.amazonaws.com";
