declare module "mktemp" {
  export function createFile(template: string, callback: (err: Error, filename: string) => void): void;
  export function createFileSync(template: string): string;
  export function createDir(template: string, callback: (err: Error, filename: string) => void);
  export function createDirSync(template: string): string;
}
