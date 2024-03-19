"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedUser = void 0;
exports.mockedUser = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};
