/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Publisher from "./Publisher";
import Command, { ICommand, ICommandProps } from "./Command";
export interface ICommandDispatcher {
    dispatch: () => void;
}
export default class Commander extends Publisher {
    protected static readonly defaultCapacity = 30;
    protected stack: ICommand[];
    protected pointer: number;
    protected capacity: number;
    constructor(capacity?: number);
    register<T extends Function>(factory: (args: any[]) => Command<T>): T;
    register<T extends Function>(props: ICommandProps<T>): T;
    setCapacity(capacity: number): void;
    do(command: ICommand): void;
    undo(): void;
    redo(): void;
    clear(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    getUndoText(): string;
    getRedoText(): string;
}
