export type Products = {
  id: string;
  model: string;
  category: string;
  specs: object;
  image: string;
  colors: [];
  price: string
  carrusel: object;
  video: string;
  website: string;
};

export interface LoginInterface {
  email: string,
  password: string,
};

export interface InputInterface {
  type: string,
  name: string,
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  autoComplete: string,
  errors: string | undefined,
}