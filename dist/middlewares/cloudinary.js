"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'dcs59seit',
    api_key: '457876187627667',
    api_secret: 'SO4fnRMSuBw2Q3kYwowQwZOX95o'
});
exports.default = cloudinary_1.v2;
