// custom.d.ts
declare const __webpack_require__: typeof require;
declare const require: {
  context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
    resolve(id: string): string;
    id: string;
  };
};
