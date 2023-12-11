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