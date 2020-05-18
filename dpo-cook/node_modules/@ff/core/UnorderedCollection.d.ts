/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Dictionary, MaybeIdentifiable } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";
/**
 * Fired after the [[UnorderedCollection]] has been updated.
 * @event
 */
export interface ICollectionUpdateEvent<T extends MaybeIdentifiable> extends ITypedEvent<"update"> {
    item: T;
    what: "insert" | "remove" | "update";
}
/**
 * Container storing an unordered collection of items. Items can be retrieved and manipulated by
 * id. Internally, the collection is stored in a key/value dictionary. Items may provide an
 * 'id' property with a unique identifier.
 *
 * Updates to the collection are published via [[ICollectionUpdateEvent]] events.
 */
export default class UnorderedCollection<T extends MaybeIdentifiable> extends Publisher {
    private _dict;
    /**
     * Returns the number of items in the collection.
     */
    get length(): number;
    /**
     * Returns an unordered array with all collection items.
     */
    get items(): T[];
    set items(items: T[]);
    /**
     * Returns an unordered array with the ids of all collection items.
     */
    get ids(): string[];
    /**
     * Returns a shallow copy of the internal id/item dictionary.
     */
    get dictionary(): Dictionary<T>;
    set dictionary(dict: Dictionary<T>);
    constructor(items?: T[]);
    insert(item: T, id?: string): void;
    remove(itemOrId: T | string): void;
    get(id: string): T;
    getOrCreate(id: string, defaultItem: T): T;
    /**
     * Replaces the internal id/item dictionary with a shallow copy of the given id/item dictionary.
     * @param dict
     */
    copy(dict: Dictionary<T>): void;
    /**
     * Returns a shallow copy of the internal id/item dictionary.
     */
    clone(): Dictionary<T>;
}
