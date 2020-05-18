"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Publisher_1 = require("./Publisher");
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
class OrderedCollection extends Publisher_1.default {
    constructor(items) {
        super();
        this.addEvent("update");
        this._list = items || [];
        this._dict = {};
        items && items.forEach(item => {
            if (item.id) {
                this._dict[item.id] = item;
            }
        });
    }
    /**
     * Returns the number of items in the collection.
     */
    get length() {
        return this._list.length;
    }
    /**
     * Returns an unordered array with the ids of all collection items.
     */
    get ids() {
        return Object.keys(this._dict);
    }
    /**
     * Returns an ordered array with all collection items.
     */
    get items() {
        return this._list;
    }
    /**
     * Replaces the collection items with the given list.
     * @param items
     */
    set items(items) {
        this._list = items;
        this._dict = {};
        items.forEach(item => {
            if (item.id) {
                this._dict[item.id] = item;
            }
        });
        this.emit({ type: "update", item: null, what: "update" });
    }
    /**
     * Adds an item at the end of the collection.
     * @param item
     */
    append(item) {
        this._list.push(item);
        if (item.id) {
            this._dict[item.id] = item;
        }
        this.emit({ type: "update", item, what: "add" });
    }
    /**
     * Inserts an item in front of another one.
     * @param item
     * @param beforeItem
     */
    insertBefore(item, beforeItem) {
        const index = this._list.indexOf(beforeItem);
        if (index >= 0) {
            this.insertAt(item, index);
        }
    }
    /**
     * Inserts an item at a given position index.
     * @param item
     * @param index
     */
    insertAt(item, index) {
        this._list.splice(index, 0, item);
        if (item.id) {
            this._dict[item.id] = item;
        }
        this.emit({ type: "update", item, what: "add" });
    }
    /**
     * Replaces an item with another one.
     * @param item The new item.
     * @param replaceItem The item to be replaced.
     */
    replaceItem(item, replaceItem) {
        const index = this._list.indexOf(replaceItem);
        if (index >= 0) {
            this.replaceAt(item, index);
        }
    }
    /**
     * Replaces the item at the given index position with another one.
     * @param item
     * @param index
     */
    replaceAt(item, index) {
        const existing = this._list[index];
        if (existing.id) {
            delete this._dict[existing.id];
        }
        this._list[index] = item;
        if (item.id) {
            this._dict[item.id] = item;
        }
        this.emit({ type: "update", item, what: "replace" });
    }
    /**
     * Moves the item relative to its current position.
     * @param item The item to move.
     * @param relativeIndex The number of positions to move, positive = move towards end, negative = move towards start.
     */
    moveItem(item, relativeIndex) {
        const index = this._list.indexOf(item);
        this.moveAt(index, relativeIndex);
    }
    /**
     * Moves the item at the given index position relative to its current position.
     * @param index The index of the item to move.
     * @param relativeIndex The number of positions to move, positive = move towards end, negative = move towards start.
     */
    moveAt(index, relativeIndex) {
        const items = this._list;
        if (index + relativeIndex < 0 || index + relativeIndex >= items.length) {
            return;
        }
        const item = items[index];
        if (relativeIndex > 0) {
            for (let i = 0; i < relativeIndex; ++i) {
                items[index + i] = items[index + i + 1];
            }
            items[index + relativeIndex] = item;
        }
        else if (relativeIndex < 0) {
            for (let i = 0; i > relativeIndex; --i) {
                items[index + i] = items[index + i - 1];
            }
            items[index + relativeIndex] = item;
        }
        else {
            return;
        }
        this.emit({ type: "update", item, what: "move" });
    }
    /**
     * Removes an item by its id.
     * @param id
     * @returns the removed item.
     */
    removeById(id) {
        const item = this._dict[id];
        if (item) {
            this.removeItem(item);
        }
        return item;
    }
    /**
     * Removes the given item from the collection.
     * @param item
     * @returns the position index of the removed item.
     */
    removeItem(item) {
        const index = this._list.indexOf(item);
        this.removeAt(index);
        return index;
    }
    /**
     * Removes the item at the given index position from the collection.
     * @param index
     * @returns the removed item.
     */
    removeAt(index) {
        const items = this._list;
        if (index < 0 || index >= items.length) {
            return;
        }
        const item = items[index];
        items.splice(index, 1);
        if (item.id) {
            delete this._dict[item.id];
        }
        this.emit({ type: "update", item, what: "remove" });
        return item;
    }
    /**
     * Returns the item at the given index position.
     * @param index
     */
    getAt(index) {
        return this._list[index];
    }
    /**
     * Return an item by its id.
     * @param id
     */
    getById(id) {
        return this._dict[id];
    }
    /**
     * Returns the index position of the given item.
     * @param item
     */
    getIndexOf(item) {
        return this._list.indexOf(item);
    }
    /**
     * Replaces the collection items with a shallow copy of the given list.
     * @param list
     */
    copy(list) {
        this.items = list.slice();
    }
    /**
     * Returns a shallow copy of the internal item list.
     */
    clone() {
        return this._list.slice();
    }
}
exports.default = OrderedCollection;
OrderedCollection.prototype[Symbol.iterator] = function () {
    return {
        index: 0,
        list: this._list,
        next: function () {
            if (this.index < this.list.length) {
                return { value: this.list[this.index++], done: false };
            }
            else {
                return { done: true };
            }
        }
    };
};
//# sourceMappingURL=OrderedCollection.js.map