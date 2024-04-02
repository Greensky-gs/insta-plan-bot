export type If<C, A, B = any> = C extends true ? A : C extends false ? B : never;
