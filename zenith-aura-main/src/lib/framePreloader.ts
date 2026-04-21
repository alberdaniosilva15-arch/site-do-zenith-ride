/**
 * Centralised frame preloader.
 * Loads all hero + morph frames in parallel, exposes a real progress
 * percentage tied to Promise.all completion, and caches the decoded
 * HTMLImageElements so FrameSequence can consume them without re-fetching.
 */

export interface FrameSet {
  folder: string;
  count: number;
  ext: "jpg" | "png" | "webp";
  padding: number;
}

export const FRAME_SETS: FrameSet[] = [
  { folder: "hero", count: 128, ext: "jpg", padding: 3 },
  { folder: "morph", count: 136, ext: "jpg", padding: 3 },
];

const cache = new Map<string, HTMLImageElement>();
const availability = new Map<string, boolean>();

let progress = 0;
let total = FRAME_SETS.reduce((acc, s) => acc + s.count, 0);
let completed = 0;
let started = false;
let finishedPromise: Promise<void> | null = null;

const listeners = new Set<(p: number) => void>();

function notify() {
  progress = total === 0 ? 1 : completed / total;
  listeners.forEach((l) => l(progress));
}

function srcFor(set: FrameSet, i: number) {
  const path = `/${set.folder}/${String(i).padStart(set.padding, "0")}.${set.ext}`;
  console.log(`[framePreloader] Loading: ${path}`);
  return path;
}

function loadOne(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    (img as HTMLImageElement & { decoding?: string }).decoding = "async";
    img.onload = () => {
      console.log(`[framePreloader] Loaded: ${src}`);
      cache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      console.log(`[framePreloader] ERROR: ${src} not found`);
      resolve(null);
    };
    img.src = src;
  });
}

export function startPreloading(): Promise<void> {
  if (finishedPromise) return finishedPromise;
  started = true;

  const tasks: Promise<void>[] = [];
  let anyOk = false;

  for (const set of FRAME_SETS) {
    let setOk = false;
    for (let i = 1; i <= set.count; i++) {
      const src = srcFor(set, i);
      tasks.push(
        loadOne(src).then((img) => {
          if (img) {
            anyOk = true;
            setOk = true;
          }
          completed++;
          notify();
          // mark availability after final frame of a set resolves
          if (i === set.count) availability.set(set.folder, setOk);
        })
      );
    }
  }

  finishedPromise = Promise.all(tasks).then(() => {
    // Even if frames missing, resolve so the loader can proceed
    void anyOk;
  });
  return finishedPromise;
}

export function getProgress() {
  return progress;
}

export function onProgress(listener: (p: number) => void): () => void {
  listeners.add(listener);
  listener(progress);
  return () => listeners.delete(listener);
}

export function getCachedImage(folder: string, i: number, ext = "jpg", padding = 3) {
  const src = `/${folder}/${String(i).padStart(padding, "0")}.${ext}`;
  return cache.get(src) ?? null;
}

export function getCachedImagesFor(folder: string, count: number, ext = "jpg", padding = 3) {
  const out: HTMLImageElement[] = [];
  for (let i = 1; i <= count; i++) {
    const img = getCachedImage(folder, i, ext, padding);
    if (img) out.push(img);
  }
  return out;
}

export function isFolderAvailable(folder: string): boolean | null {
  if (!started) return null;
  return availability.get(folder) ?? null;
}

export function hasStarted() {
  return started;
}
