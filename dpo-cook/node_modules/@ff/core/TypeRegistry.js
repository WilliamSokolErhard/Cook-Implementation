"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Publisher_1 = require("./Publisher");
class TypeRegistry extends Publisher_1.default {
    constructor() {
        super();
        this._dict = {};
        this.addEvent("type");
    }
    add(type) {
        if (Array.isArray(type)) {
            type.forEach(type => this.add(type));
            return;
        }
        const typeName = type.typeName;
        if (!typeName) {
            throw new Error("type must have a 'typeName' member");
        }
        if (this._dict[typeName]) {
            throw new Error(`type '${typeName}' already registered`);
        }
        this._dict[typeName] = type;
        this.emit({ type: "type", add: true, remove: false, classType: type });
    }
    remove(type) {
        if (Array.isArray(type)) {
            type.forEach(type => this.remove(type));
            return;
        }
        const typeName = type.typeName;
        if (!typeName) {
            throw new Error("type must have a 'typeName' member");
        }
        if (!this._dict[typeName]) {
            throw new Error(`type '${typeName}' not registered`);
        }
        delete this._dict[typeName];
        this.emit({ type: "type", add: false, remove: true, classType: type });
    }
    getType(typeHint) {
        let typeName = typeHint;
        if (typeof typeHint === "function") {
            typeName = typeHint.typeName;
        }
        else if (typeof typeHint === "object") {
            typeName = typeHint.constructor.typeName;
        }
        return this._dict[typeName];
    }
    createInstance(typeHint, ...args) {
        const type = this.getType(typeHint);
        if (!type) {
            throw new Error(`type '${typeHint}' not registered`);
        }
        return new type(...args);
    }
}
exports.default = TypeRegistry;
//# sourceMappingURL=TypeRegistry.js.map