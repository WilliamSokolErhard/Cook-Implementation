/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
import Publisher from "./Publisher";
/**
 * Subscribes to events on one or multiple publishers.
 * Subscription can be started and stopped for all registered publishers at once.
 * Events are untyped and event arguments are not delivered.
 */
export default class Subscriber {
    private _type;
    private _callback;
    private _context;
    private _publishers;
    constructor(type: string, callback: (e: any) => void, context?: any);
    on(...publishers: Publisher[]): this;
    off(): this;
}
