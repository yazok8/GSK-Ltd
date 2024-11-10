// src/types/File.ts

export interface ServerFile {
  fieldname: string; 
  buffer: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
}

  