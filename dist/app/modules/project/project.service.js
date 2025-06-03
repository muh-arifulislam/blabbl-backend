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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const project_model_1 = require("./project.model");
const addOneIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.Project.create(payload);
    return result;
});
const deleteOneFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.Project.findByIdAndDelete(id);
    return result;
});
const getOneFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.Project.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project data did not exits');
    }
    return result;
});
const getManyFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.Project.aggregate([
        {
            $addFields: {
                parsedToDate: {
                    $dateFromString: {
                        dateString: { $concat: ['01 ', '$projectDuration.to'] },
                        format: '%d %b %Y',
                    },
                },
            },
        },
        { $sort: { parsedToDate: -1 } }, // -1 for descending order (latest first)
    ]);
    return projects;
});
const addManyIntoDB = (payloadArr) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.Project.insertMany(payloadArr);
    return result;
});
exports.ProjectServices = {
    addOneIntoDB,
    deleteOneFromDB,
    getOneFromDB,
    getManyFromDB,
    addManyIntoDB,
};
