import { atom } from "jotai";
import type { TickInfo } from "@/shared/types";

export const tickInfoAtom = atom<TickInfo>({} as TickInfo);
