"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedLike = void 0;
exports.mockedLike = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};
