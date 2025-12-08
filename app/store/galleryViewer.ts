type ViewerItem = {
  id: string;
  url: string;
  caption?: string;
  type?: string;
  folderId?: string;
};

const store = {
  items: [] as ViewerItem[],
  startIndex: 0,
  setItems(items: ViewerItem[], start = 0) {
    this.items = items;
    this.startIndex = start;
  },
  clear() {
    this.items = [];
    this.startIndex = 0;
  },
};

// simple hook to access store - in your components import { useGalleryViewer }
export const useGalleryViewer = () => {
  return {
    get items() {
      return store.items;
    },
    get startIndex() {
      return store.startIndex;
    },
    setItems: (items: ViewerItem[], start = 0) => store.setItems(items, start),
    clear: () => store.clear(),
  };
};

// also expose for direct access in pages (like before)
export default {
  getState: () => store,
};
