export type Products = {
  id: string;
  model: string;
  category: string;
  specs: {
    platform: string;
    description: string;
  };
  image: string;
  colors: [];
  price: number;
  carrusel: object;
  video: string;
  website: string;
};
