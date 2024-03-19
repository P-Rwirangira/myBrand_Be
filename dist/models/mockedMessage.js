"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedMessage = void 0;
exports.mockedMessage = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};
