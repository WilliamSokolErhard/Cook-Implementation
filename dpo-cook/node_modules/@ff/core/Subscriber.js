"use strict";
/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
/**
 * Subscribes to events on one or multiple publishers.
 * Subscription can be started and stopped for all registered publishers at once.
 * Events are untyped and event arguments are not delivered.
 */
class Subscriber {
    constructor(type, callback, context) {
        this._type = type;
        this._callback = callback;
        this._context = context;
        this._publishers = [];
    }
    on(...publishers) {
        publishers.forEach(publisher => {
            this._publishers.push(publisher);
            publisher.on(this._type, this._callback, this._context);
        });
        return this;
    }
    off() {
        this._publishers.forEach(pub => pub.off(this._type, this._callback, this._context));
        this._publishers.length = 0;
        return this;
    }
}
exports.default = Subscriber;
//# sourceMappingURL=Subscriber.js.map