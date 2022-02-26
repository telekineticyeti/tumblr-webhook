declare namespace tumblerApiResponse {
  interface post {
    object_type: ObjectType;
    type: string;
    id: string;
    tumblelog_uuid: string;
    original_type: PostType;
    blog_name: string;
    blog: BlogInfo;
    id_string: string;
    post_url: string;
    slug: string;
    date: string;
    timestamp: number;
    state: BlogState;
    reblog_key: string;
    tags: string[];
    short_url: string;
    summary: string;
    should_open_in_legacy: boolean;
    recommended_source: any | null;
    recommended_color: any | null;
    followed: boolean;
    liked: boolean;
    note_count: number;
    content: BlogContent[];
    layout: [];
    trail: TrailItem[];
    can_like: boolean;
    interactability_reblog: string;
    can_reblog: boolean;
    can_send_in_message: boolean;
  }

  interface BlogInfo {
    name: string;
    title: string;
    description: string;
    url: string;
    uuid: string;
    updated: number;
  }

  interface BlogContent {
    type: 'image' | 'text';
    media?: MediaAttachment[];
    colors?: {
      c0: string;
      c1: string;
    };
    text?: string;
  }

  interface MediaAttachment {
    media_key: string;
    type: MediaType;
    width: number;
    height: number;
    url: string;
    colors?: {
      c0: string;
      c1: string;
    };
    cropped?: boolean;
  }

  interface TrailItem {
    content: BlogContent[];
    layout: LayoutType[];
    post: {id: string};
    blog: BlogInfoTrail;
  }

  interface BlogInfoTrail extends BlogInfo {
    subscribed: boolean;
    can_subscribe: boolean;
    followed: boolean;
    active: boolean;
  }

  interface LayoutType {
    type: string;
    display: any[];
  }

  type ObjectType = 'post';

  type PostType = 'photo' | 'regular';

  type BlogState = 'published';

  type MediaType = 'image/jpeg' | 'image/png' | 'image/gif';
}
