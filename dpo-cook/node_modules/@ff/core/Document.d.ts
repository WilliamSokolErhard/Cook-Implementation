/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Publisher, { ITypedEvent } from "./Publisher";
export interface IDocumentUpdateEvent<T extends Document = Document> extends ITypedEvent<"update"> {
    document: T;
}
export interface IDocumentDisposeEvent<T extends Document = Document> extends ITypedEvent<"dispose"> {
    document: T;
}
export default class Document<T extends any = any, U = T> extends Publisher {
    static generateId(): any;
    private _data;
    constructor(json?: U);
    get id(): any;
    get data(): T;
    set<K extends keyof T>(key: K, value: T[K]): void;
    get<K extends keyof T>(key: K): T[K];
    update(): void;
    dispose(): void;
    fromJSON(json: U): this;
    toJSON(json?: U): U;
    protected init(): T;
    protected inflate(json: U, data: T): void;
    protected deflate(data: T, json: U): void;
}
