import { atom } from "jotai";

export type Query = { searchValue?: string; searchType?: string };

export const queryAtom = atom<Query>({});
