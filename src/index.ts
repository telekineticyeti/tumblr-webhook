import TumblrHelperClass from './lib/tumblr.helper.class';
import * as http from 'http';
import * as download from 'image-downloader';
import config from './config';

const tumblrHelper = new TumblrHelperClass();

const server = http.createServer();
server.listen(config.port);

server.on('request', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Invalid request method.');
    }

    const buffers: any[] = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const reqJson = JSON.parse(Buffer.concat(buffers).toString()) as {
      url: string;
    };

    if (!reqJson || !reqJson.url) {
      throw new Error(`Invalid request JSON: \n${reqJson || JSON.stringify(buffers)}`);
    }

    const resolved = tumblrHelper.resolvePostInfoFromUrl(reqJson.url);

    if (resolved === null) {
      throw new Error('Blog post data could not be resolved');
    }

    let mediaCount = 0;

    await tumblrHelper
      .resolvePostMedia(resolved)
      .then(media => {
        return Promise.all(
          media.map(m => {
            mediaCount = media.length;
            return download.image({
              url: m.url,
              dest: `${config.downloadPath}/${m.filename}.${m.extension}`,
              extractFilename: false,
            });
          }),
        );
      })
      .catch(e => {
        throw new Error(e);
      });

    res.writeHead(200);
    res.end(`Downloaded ${mediaCount} files from ${reqJson.url}`);
  } catch (error) {
    console.error(error);
    res.writeHead(404);
    res.end(`Invalid request.`);
  }
});
