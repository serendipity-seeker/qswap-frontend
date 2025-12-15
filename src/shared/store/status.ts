import { atom } from "jotai";
import type { ArchiverStatus, LatestStats } from "@/shared/types";

export const statusAtom = atom<ArchiverStatus | null>(null);

export const latestStatsAtom = atom<LatestStats>({} as LatestStats);
