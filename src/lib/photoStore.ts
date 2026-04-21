import { get, set, del, keys } from 'idb-keyval';

const PREFIX = 'pulse:photo:';

export async function savePhoto(id: string, blob: Blob): Promise<void> {
  await set(PREFIX + id, blob);
}

export async function getPhoto(id: string): Promise<Blob | undefined> {
  return (await get(PREFIX + id)) as Blob | undefined;
}

export async function deletePhoto(id: string): Promise<void> {
  await del(PREFIX + id);
}

export async function listPhotoIds(): Promise<string[]> {
  const all = (await keys()) as string[];
  return all
    .filter((k) => typeof k === 'string' && k.startsWith(PREFIX))
    .map((k) => k.slice(PREFIX.length));
}
