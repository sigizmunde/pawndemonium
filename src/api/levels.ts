import { promises as fs } from 'fs';
import path from 'path';
import { LevelConcept } from '@/types';

export async function getLevels(id: string = ''): Promise<LevelConcept[]> {
  const filePath = path.resolve('files', `levels${id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as LevelConcept[];
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      // file does not exist, create it with an empty array
      await fs.writeFile(filePath, JSON.stringify([]), 'utf8');
      return [];
    }
    throw error;
  }
}

export async function writeLevels(
  id: string = '',
  levels: LevelConcept[]
): Promise<void> {
  const filePath = path.resolve('files', `levels${id}.json`);
  const data = JSON.stringify(levels, null, 2);
  await fs.writeFile(filePath, data, 'utf8');
}
