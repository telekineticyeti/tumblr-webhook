import tumblr from 'tumblr.js';
import config from '../config';
import mime from 'mime-types';

const {consumer_key, consumer_secret, token, token_secret} = config;

export default class TumblrHelperClass {
  public client = tumblr.createClient({
    consumer_key,
    consumer_secret,
    token,
    token_secret,
  });

  public resolvePostInfoFromUrl = (postUrl: string): IResolvedPostInfo | null => {
    const postIDRegex = /[^"\/www\."](?<!w{3})[A-Za-z0-9-_]*(?=!\.tumblr\.com)|(?<=\.tumblr\.com\/post\/)[0-9]*/;
    const usernameRegex = /[^"\/www\."](?<!w{3})[A-Za-z0-9-_]*(?=\.tumblr\.com)|(?<=\.tumblr\.com\/blog\/).*/;
    // Alternative resolution strategy for blogs with custom domains.
    const fallbackusernameRegex = /(?:https?:\/\/)?(?:www\.)?([^:\/\n]+)/;
    const fallbackPostIdRegex = /\d{11,}/;
    let blogMatch = postUrl.match(usernameRegex);
    let postMatch = postUrl.match(postIDRegex);

    const fallbackResolver = () => {
      return [postUrl.match(fallbackusernameRegex), postUrl.match(fallbackPostIdRegex)];
    };

    let blog: string;
    let post: string;

    if (!blogMatch || !postMatch) {
      [blogMatch, postMatch] = fallbackResolver();
      if (!blogMatch || !postMatch) {
        return null;
      }
      blog = blogMatch[1];
      post = postMatch[0];
    } else {
      blog = blogMatch[0];
      post = postMatch[0];
    }
    return {blog, post};
  };

  public constructFilename(post: tumblerApiResponse.post) {
    let mediaName = `${post.blog_name}`;

    if (post.slug) {
      mediaName = `${mediaName} - ${post.slug}`;
    }

    mediaName = `${mediaName} (${post.id})`;

    return mediaName;
  }

  public resolvePost(postInfo: IResolvedPostInfo): Promise<tumblerApiResponse.post> {
    return new Promise((resolve, reject) => {
      this.client.blogPosts(postInfo.blog, postInfo.post, async (error: any, post: tumblerApiResponse.post) => {
        if (error) return reject(error);
        if (!post) return reject(`Post ${JSON.stringify(postInfo)} could not be resolved`);
        if (post.original_type !== 'photo') return reject(`${JSON.stringify(postInfo)} is not photo type`);
        return resolve(post);
      });
    });
  }

  public async resolvePostMedia(postInfo: IResolvedPostInfo) {
    try {
      let post = await this.resolvePost(postInfo);

      if (post.trail.length) {
        const originBlogName = post.trail[0].blog.name;
        const originPostId = post.trail[0].post.id;
        post = await this.resolvePost({
          blog: originBlogName,
          post: originPostId,
        });
        console.info(`Origin post resolved! ${originBlogName}/${originPostId}`);
      }

      const media: IResolvedMedia[] = [];
      const hasMultipleContentMedia = post.content.length > 0;
      let filename = this.constructFilename(post);

      post.content.forEach((content, idx) => {
        if (content.media?.length) {
          media.push({
            filename: hasMultipleContentMedia ? `${filename} ${idx + 1}` : filename,
            extension: mime.extension(content.media[0].type) || '',
            url: content.media[0].url,
          });
        }
      });

      return media;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}

export interface IResolvedPostInfo {
  blog: string;
  post: string;
}

export interface IResolvedMedia {
  filename: string;
  extension: string;
  url: string;
}
