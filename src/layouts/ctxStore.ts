import { atom } from "nanostores";

type gameCtx = "menu" | "gameover" | "game";
export const ctx = atom("menu");

export const score = atom(0);
