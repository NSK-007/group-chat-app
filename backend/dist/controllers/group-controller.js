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
exports.getGroups = exports.createMembership = exports.createGroup = void 0;
const transaction_services_1 = require("../services/transaction-services");
const group_services_1 = require("../services/group-services");
const user_services_1 = require("../services/user-services");
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield (0, transaction_services_1.transaction)();
    let group;
    try {
        group = yield (0, group_services_1.createNewGroup)(req.body.name, t);
        //   console.log(+req.user.id);
        yield (0, group_services_1.createGroupMembership)(group, +req.user.id, req.body.name, t);
        yield t.commit();
        res.status(200).json({ success: true, group });
    }
    catch (err) {
        console.log(err);
        yield t.rollback();
        res.status(201).send({ success: false, error: err.message, group, user: req.user });
    }
});
exports.createGroup = createGroup;
const createMembership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield (0, transaction_services_1.transaction)();
    let group;
    try {
        let params = req.params;
        let body = req.body;
        group = yield (0, group_services_1.getGroupById)(+params.group_id);
        if (group === undefined || group === null)
            throw new Error('Group Not Found');
        let user = yield (0, user_services_1.findUserByPhone)(body.phone);
        if (user === undefined || user === null)
            throw new Error('User Not Found');
        let membership = yield (0, group_services_1.createGroupMembership)(group, +user.id, group.name, t);
        yield t.commit();
        res.status(200).json({ success: true, membership });
    }
    catch (err) {
        console.log(err);
        yield t.rollback();
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.createMembership = createMembership;
const getGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let groups = yield (0, group_services_1.getAllUserGroups)(+req.user.id);
        res.status(200).json({ success: true, groups });
    }
    catch (err) {
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.getGroups = getGroups;
