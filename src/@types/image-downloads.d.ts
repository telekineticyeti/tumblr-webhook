declare module 'image-downloader' {
  function image(options: Options): Promise<{filename: string}>;

  interface Options {
    url: string;
    dest: string;
    extractFilename?: boolean;
  }
}
