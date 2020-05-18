/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { MaybeIdentifiable } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";
/**
 * Fired after the [[OrderedCollection]] has been updated.
 * @event
 */
export interface ICollectionUpdateEvent<T extends MaybeIdentifiable> extends ITypedEvent<"update"> {
    item: T;
    what: "add" | "remove" | "replace" | "move" | "update";
}
/**
 * Container storing an ordered list of items. Items can be retrieved and manipulated by
 * id or by positional index. Internally, the collection is stored in both an array and
 * a dictionary.
 *
 * To make use of the dictionary functionality, items must provide an 'id' property with
 * a unique identifier.
 *
 * Updates to the collection are published via [[ICollectionUpdateEvent]] events.
 */
export default class OrderedCollection<T extends MaybeIdentifiable> extends Publisher {
    private _list;
    private _dict;
    constructor(items?: T[]);
    /**
     * Returns the number of items in the collection.
     */
    get length(): number;
    /**
     * Returns an unordered array with the ids of all collection items.
     */
    get ids(): string[];
    /**
     * Returns an ordered array with all collection items.
     */
    get items(): T[];
    /**
     * Replaces the collection items with the given list.
     * @param items
     */
    set items(items: T[]);
    /**
     * Adds an item at the end of the collection.
     * @param item
     */
    append(item: T): void;
    /**
     * Inserts an item in front of another one.
     * @param item
     * @param beforeItem
     */
    insertBefore(item: T, beforeItem: T): void;
    /**
     * Inserts an item at a given position index.
     * @param item
     * @param index
     */
    insertAt(item: T, index: number): void;
    /**
     * Replaces an item with another one.
     * @param item The new item.
     * @param replaceItem The item to be replaced.
     */
    replaceItem(item: T, replaceItem: T): void;
    /**
     * Replaces the item at the given index position with another one.
     * @param item
     * @param index
     */
    replaceAt(item: T, index: number): void;
    /**
     * Moves the item relative to its current position.
     * @param item The item to move.
     * @param relativeIndex The number of positions to move, positive = move towards end, negative = move towards start.
     */
    moveItem(item: T, relativeIndex: number): void;
    /**
     * Moves the item at the given index position relative to its current position.
     * @param index The index of the item to move.
     * @param relativeIndex The number of positions to move, positive = move towards end, negative = move towards start.
     */
    moveAt(index: number, relativeIndex: number): void;
    /**
     * Removes an item by its id.
     * @param id
     * @returns the removed item.
     */
    removeById(id: string): T;
    /**
     * Removes the given item from the collection.
     * @param item
     * @returns the position index of the removed item.
     */
    removeItem(item: T): number;
    /**
     * Removes the item at the given index position from the collection.
     * @param index
     * @returns the removed item.
     */
    removeAt(index: number): T;
    /**
     * Returns the item at the given index position.
     * @param index
     */
    getAt(index: number): T;
    /**
     * Return an item by its id.
     * @param id
     */
    getById(id: string): T;
    /**
     * Returns the index position of the given item.
     * @param item
     */
    getIndexOf(item: T): number;
    /**
     * Replaces the collection items with a shallow copy of the given list.
     * @param list
     */
    copy(list: T[]): void;
    /**
     * Returns a shallow copy of the internal item list.
     */
    clone(): T[];
}
