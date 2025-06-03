"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const blog_model_1 = require("./blog.model");
const getBlogsFromServer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { searchTerm, category } = req.query;
    const page = Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
    const limit = Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) || 9;
    const skip = (page - 1) * limit;
    let query = {};
    if (searchTerm) {
        query = {
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { subTitle: { $regex: searchTerm, $options: 'i' } },
            ],
        };
    }
    if (category === null || category === void 0 ? void 0 : category.length) {
        query = Object.assign({ category: category }, query);
    }
    const products = yield blog_model_1.Blog.find(query)
        .skip(skip)
        .limit(Number(limit))
        .populate({
        path: 'user',
        select: {
            _id: true,
            firstName: true,
            lastName: true,
        },
    });
    const total = yield blog_model_1.Blog.countDocuments(query);
    return {
        data: products,
        meta: {
            total,
            page,
            limit,
            skip,
            hasMore: skip + limit < total,
        },
    };
});
const getFeaturedBlogsFromServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.find()
        .limit(2)
        .populate({
        path: 'user',
        select: {
            _id: true,
            firstName: true,
            lastName: true,
        },
    });
    return result;
});
const getBlogFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findById(id).populate({
        path: 'user',
        select: {
            _id: true,
            firstName: true,
            lastName: true,
        },
    });
    return result;
});
exports.BlogServices = {
    getBlogsFromServer,
    getFeaturedBlogsFromServer,
    getBlogFromDB,
};
