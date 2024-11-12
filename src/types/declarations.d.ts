declare module 'formidable' {
    import { IncomingMessage } from 'http';
  
    interface Fields {
      [key: string]: string | string[];
    }
  
    interface Files {
      [key: string]: File | File[];
    }
  
    interface File {
      size: number;
      filepath: string;
      originalFilename?: string;
      mimetype?: string;
      newFilename: string;
      // Add other properties you use
    }
  
    class IncomingForm {
      parse(
        req: IncomingMessage,
        callback?: (err: unknown, fields: Fields, files: Files) => void
      ): void;
      // Add other methods and properties as needed
    }
  
    export { Fields, Files, File, IncomingForm };
    export default IncomingForm;
  }
  