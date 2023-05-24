import { defineStore } from "pinia";

// Função auxiliar para obter o valor do campo de conteúdo
function getContentValue(item) {
  const contentSelectors = ["content", "description", "encoded", "summary"];

  for (const selector of contentSelectors) {
    const contentElement = item.querySelector(selector);
    if (contentElement && contentElement.textContent) {
      return contentElement.textContent;
    }
  }

  return ""; // Retorna uma string vazia caso nenhum valor seja encontrado
}

export const useFeedStore = defineStore({
  id: "feedStore",
  state: () => {
    return {
      sources: [
        {
          id: crypto.randomUUID(),
          name: "Mozilla Hacks",
          url: "https://hacks.mozilla.org/feed",
        },
        {
          id: crypto.randomUUID(),
          name: "The Verge",
          url: "https://www.theverge.com/rss/index.xml",
        },
      ],
      current: {
        source: null,
        items: null,
      },
    };
  },
  actions: {
    async loadSource(source) {
      const response = await fetch(source.url);
      let text = await response.text();
      text = text.replace(/content:encoded/g, "content");

      const domParser = new DOMParser();
      let doc = domParser.parseFromString(text, "text/xml");

      const posts = [];

      doc.querySelectorAll("item, entry").forEach((item) => {
        const post = {
          title: item.querySelector("title").textContent ?? "",
          content: getContentValue(item),
        };
        posts.push(post);
      });

      this.current.items = [...posts];
      this.current.source = source;
    },
    async registerNewSource(url) {
      try {
        const response = await fetch(url);
        let text = await response.text();
        const domParser = new DOMParser();
        let doc = domParser.parseFromString(text, "text/xml");
        const title = doc.querySelector("channel title, feed title");

        const source = {
          id: crypto.randomUUID(),
          name: title.textContent,
          url,
        };
        this.sources.push(source);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
