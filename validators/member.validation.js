const Joi = require("joi");

// CREATE MEMBER
exports.createMemberSchema = Joi.object({
    member_id: Joi.string().max(30).required(),
    member_name: Joi.string().max(50).required(),
    email: Joi.string().email().max(30).required(),
    mobile_phone: Joi.string().max(20).required(),
    join_date: Joi.date().optional(),
    birth_date: Joi.date().optional()
});

// UPDATE MEMBER
exports.updateMemberSchema = Joi.object({
    member_name: Joi.string().max(50).optional(),
    email: Joi.string().email().max(30).optional(),
    mobile_phone: Joi.string().max(20).optional(),
    join_date: Joi.date().optional(),
    birth_date: Joi.date().optional()
});