"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const project_validation_1 = require("./project.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const validateAuth_1 = __importDefault(require("../../middlewares/validateAuth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/:id', project_controller_1.ProjectControllers.getProject);
router.post('/', (0, validateAuth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(project_validation_1.ProjectValidations.addOneValidationSchema), project_controller_1.ProjectControllers.addProject);
router.post('/add-bulk', (0, validateAuth_1.default)(user_constant_1.USER_ROLE.admin), project_controller_1.ProjectControllers.addProjects);
router.get('/', project_controller_1.ProjectControllers.getProjects);
exports.ProjectRoutes = router;
