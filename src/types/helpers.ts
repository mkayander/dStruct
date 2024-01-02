export type Constructor = new (...args: any[]) => object;

export type ClassOf<T> = new (...args: any[]) => T;
