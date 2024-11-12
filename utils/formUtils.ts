import { z } from 'zod';
import Busboy from 'busboy';
import { Readable } from 'stream';
import { uploadImageToS3 } from '@/app/admin/actions/uploadImage';
import { ServerFile } from '@/types/File';

/**
 * Converts a Fetch ReadableStream to a Node.js Readable stream.
 */
export const convertFetchStreamToNodeStream = (
  stream: ReadableStream<Uint8Array>
): Readable => {
  const nodeStream = new Readable({
    read() {},
  });

  const reader = stream.getReader();

  const pump = async () => {
    try {
      const { done, value } = await reader.read();
      if (done) {
        nodeStream.push(null);
        return;
      }
      nodeStream.push(Buffer.from(value));
      pump();
    } catch (err: any) {
      nodeStream.destroy(err);
    }
  };

  pump();

  return nodeStream;
};

/**
 * Parses multipart form data using Busboy.
 */
export const parseForm = async (req: Request): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return reject(
        new Error('Unsupported content type. Expected multipart/form-data.')
      );
    }

    const busboy = Busboy({ headers: { 'content-type': contentType } });

    const fields: Record<string, string> = {};
    const files: ServerFile[] = [];

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on(
      'file',
      (
        fieldname: string,
        file: NodeJS.ReadableStream,
        info: { filename: string; encoding: string; mimeType: string }
      ) => {
        const { filename, encoding, mimeType } = info;
        const buffers: Buffer[] = [];

        file.on('data', (data: Buffer) => {
          buffers.push(data);
        });

        file.on('end', () => {
          const fileBuffer = Buffer.concat(buffers);
          files.push({
            fieldname,
            buffer: fileBuffer,
            filename,
            encoding,
            mimetype: mimeType, // Note the change from 'mimetype' to 'mimeType'
          });
        });

        file.on('error', (err) => {
          reject(err);
        });
      }
    );

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', (err) => {
      reject(err);
    });

    if (!req.body) {
      return reject(new Error('No request body found.'));
    }

    const nodeStream = convertFetchStreamToNodeStream(req.body);
    nodeStream.pipe(busboy);
  });
};


/**
 * Validates and parses the form data.
 */
export const validateData = (
  fields: Record<string, string>,
  schema: z.ZodSchema
) => {
  const parseResult = schema.safeParse(fields);
  if (!parseResult.success) {
    throw parseResult.error;
  }
  return parseResult.data;
};

/**
 * Handles image uploads and returns the uploaded image keys.
 */
export const handleImageUploads = async (
  files: ServerFile[],
  prefix: string
): Promise<string[]> => {
  const uploadPromises = files
    .filter((file) => file.fieldname.startsWith(prefix))
    .map(async (file) => {
      return await uploadImageToS3(file);
    });

  const results = await Promise.all(uploadPromises);
  return results.filter((key): key is string => key !== null);
};

// Export ParsedForm interface
export interface ParsedForm {
  fields: Record<string, string>;
  files: ServerFile[];
}
