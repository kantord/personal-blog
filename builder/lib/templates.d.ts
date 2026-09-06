interface PostView {
  slug: string;
  title: string;
  date: string;
  body: string;
  note?: string;
}

export function renderPost(post: PostView): string;
export function renderIndex(posts: Omit<PostView, "body">[]): string;
