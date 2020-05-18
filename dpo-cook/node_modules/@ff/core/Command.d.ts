/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
export interface ICommand {
    readonly name: string;
    do: () => void;
    undo?: () => void;
    canDo: () => boolean;
    canUndo: () => boolean;
}
export interface ICommandProps<T extends Function> {
    do: T;
    undo?: (state: {}) => void;
    canDo?: () => boolean;
    target: object;
    name?: string;
}
export default class Command<T extends Function = Function> implements ICommand {
    private _props;
    private _args;
    private _state;
    constructor(args: any[], props: ICommandProps<T>);
    get name(): string;
    do(): void;
    undo(): void;
    canDo(): boolean;
    canUndo(): boolean;
}
