import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

