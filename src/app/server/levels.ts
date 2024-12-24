'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { LevelConcept } from '@/types';
import dbConnect from './db/connect';
import Levels from './model/levels';

export async function getLevelsFromFile(id: string = ''): Promise<LevelConcept[]> {
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

export async function writeLevelsToFile(
  id: string = '',
  levels: LevelConcept[]
): Promise<void> {
  const filePath = path.resolve('files', `levels${id}.json`);
  const data = JSON.stringify(levels, null, 2);
  try {
    await fs.writeFile(filePath, data, 'utf8');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function readLevelsFromDB(userEmail: string): Promise<LevelConcept[]> {
  if (!userEmail) {
    throw new Error('no user email provided');
  }
  try {
    await dbConnect();
    const filter = {
      userEmail,
    };
    const levels = await Levels.findOne(filter).then((res) => JSON.parse(res?.levels));
    return levels;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function writeLevelsToDB(
  userEmail: string,
  levels: LevelConcept[]
): Promise<{ userEmail: string; levels: LevelConcept[] }> {
  if (!userEmail) {
    throw new Error('no user email provided');
  }
  const data = JSON.stringify(levels, null, 2);
  try {
    await dbConnect();

    const filter = {
      userEmail,
    };

    const update = {
      userEmail,
      levels: data,
    };

    const options = {
      new: true, // Return the updated document (or the new one if upserted)
      upsert: true, // Create a new document if none matches the filter
      runValidators: true, // Run schema validation
    };

    const res = await Levels.findOneAndUpdate(filter, update, options);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getLevels(userEmail?: string): Promise<LevelConcept[]> {
  console.log('getting levels', userEmail);
  return userEmail ? readLevelsFromDB(userEmail) : getLevelsFromFile();
}

export async function writeLevels(params: {
  userEmail?: string;
  levels: LevelConcept[];
}): Promise<void> {
  console.log('writing levels', params.userEmail);
  params.userEmail
    ? writeLevelsToDB(params.userEmail, params.levels)
    : writeLevelsToFile(undefined, params.levels);
}
