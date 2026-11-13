interface Window {
  twttr?: {
    widgets: {
      createTweet(id: string, container: HTMLElement, options: { theme: string; dnt: boolean; align: string }): Promise<HTMLElement | undefined>;
    };
  };
}
