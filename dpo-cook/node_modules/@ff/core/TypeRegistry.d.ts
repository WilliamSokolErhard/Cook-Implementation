/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import { Dictionary, Type } from "./types";
import Publisher, { ITypedEvent } from "./Publisher";
export interface ITypeEvent extends ITypedEvent<"type"> {
    add: boolean;
    remove: boolean;
    classType: Type;
}
export default class TypeRegistry extends Publisher {
    protected _dict: Dictionary<Type>;
    constructor();
    add(type: Type | Type[]): void;
    remove(type: Type | Type[]): void;
    getType(typeHint: string | object | Type): Type | undefined;
    createInstance(typeHint: string | object | Type, ...args: any[]): object;
}
