declare module "*&as=srcset" {
  const src: string;
  export default src;
}
declare module "*&as=picture" {
  type Picture = {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  const value: Picture;
  export default value;
}