export const addBookmark = (eventId: string) => {
  const bookmarks: string[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  const newBookmarks = [...bookmarks, eventId];
  localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
};

export const removeBookmark = (eventId: string) => {
  const bookmarks: string[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  const newBookmarks = bookmarks.filter((b) => b !== eventId);
  localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
};

export const getBookmarks = () => {
  let bookmarks: string[] =
    JSON.parse(localStorage.getItem("bookmarks") ?? "[]") ?? [];
  return bookmarks;
};
