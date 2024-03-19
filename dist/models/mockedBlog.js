"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedBlog = void 0;
exports.mockedBlog = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};
