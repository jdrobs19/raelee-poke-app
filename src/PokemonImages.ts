const fetchImages = (context: any): Record<string, any> => {
  const images: Record<string, any> = {};
  const cache: Record<string, any> = {};
  function importAll(r: any) {
    r.keys().forEach((key: string) => (cache[key] = r(key)));
  }
  importAll(context);
  Object.entries(cache).forEach((module: [string, unknown]) => {
    const filename =
      module[0]
        .split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "") || "";
    images[filename] = module[1];
  });
  return images;
};

export const images = fetchImages(
  (require as any).context(
    "./assets/pokemon/shiny",
    false,
    /\.(png|jpe?g|svg)$/,
  ),
);
export const defaultImages = fetchImages(
  (require as any).context(
    "./assets/pokemon/default",
    false,
    /\.(png|jpe?g|svg)$/,
  ),
);
