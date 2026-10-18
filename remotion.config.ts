/**
 * Remotion Configuration
 * Optimized for Ultra-High Resolution (Crisp Code Rendering & Sharp Typography)
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
// Use PNG for lossless frame rendering - eliminating any JPEG compression blur around code text
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
Config.setPixelFormat("yuv420p");
Config.setCrf(14); // Ultra-high visual quality (near lossless)
Config.overrideBundlerConfig(enableTailwind);
