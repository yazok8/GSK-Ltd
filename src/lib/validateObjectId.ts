// src/lib/validateObjectId.ts

import { ObjectId } from 'mongodb'; // Ensure you have mongodb installed

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
}
