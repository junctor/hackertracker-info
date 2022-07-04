export const addBookmark = (eventId: number) => {
  if (typeof window !== "undefined") {
    const bookmarks: number[] =
      JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
    const newBookmarks = [...bookmarks, eventId];
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  }
};

export const removeBookmark = (eventId: number) => {
  if (typeof window !== "undefined") {
    const bookmarks: number[] =
      JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
    const newBookmarks = bookmarks.filter((b) => b !== eventId);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  }
};

export const getBookmarks = () => {
  if (typeof window === "undefined") {
    return [];
  }

  let bookmarks: number[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  return bookmarks;
};
