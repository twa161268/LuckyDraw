const { sql } = require("../db");

const {
    createMemberSchema,
    updateMemberSchema
} = require("../validators/member.validation");

const AppError = require("../utils/appError");

// GET ALL
exports.getAllMembers = async (req, res, next) => {
    try {
        const result = await sql.query(`
            SELECT 
                member_id,
                member_name,
                email,
                mobile_phone,
                join_date,
                birth_date
            FROM MEMBER_TWA
        `);

        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
};

// GET BY ID
exports.getMemberById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await sql.query`
            SELECT * FROM MEMBER_TWA WHERE member_id = ${id}
        `;


        if (result.recordset.length === 0) {
            throw new AppError("Member tidak ditemukan", 404);
        }

        res.json(result.recordset[0]);
    } catch (err) {
        next(err);
    }
};

// CREATE
exports.createMember = async (req, res, next) => {
    const { error } = createMemberSchema.validate(req.body);

    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }

    const {
        member_id,
        member_name,
        email,
        mobile_phone,
        join_date,
        birth_date
    } = req.body;

    try {
        await sql.query`
            INSERT INTO MEMBER_TWA (
                member_id, member_name, email, mobile_phone, join_date, birth_date
            )
            VALUES (
                ${member_id}, ${member_name}, ${email},
                ${mobile_phone}, ${join_date}, ${birth_date}
            )
        `;

        res.status(201).json({ message: "Member berhasil ditambahkan" });
    } catch (err) {
        next(err);
    }
};

// UPDATE
exports.updateMember = async (req, res, next) => {
    const { error } = updateMemberSchema.validate(req.body);

    if (error) {
    return next(new AppError(error.details[0].message, 400));
    }

    const { id } = req.params;
    const { member_name, email, mobile_phone, join_date,  birth_date } = req.body;

    try {
        await sql.query`
            UPDATE MEMBER_TWA
            SET member_name = ${member_name},
                email = ${email},
                mobile_phone = ${mobile_phone},
                join_date = ${join_date},
                birth_date = ${birth_date}
            WHERE member_id = ${id}
        `;

        res.json({ message: "Member berhasil diupdate" });
    } catch (err) {
        next(err);
    }
};

// DELETE
exports.deleteMember = async (req, res, next) => {
    const { id } = req.params;

    try {
        await sql.query`
            DELETE FROM MEMBER_TWA WHERE member_id = ${id}
        `;

        res.json({ message: "Member berhasil dihapus" });
    } catch (err) {
        next(err);
    }
};

// GET BY ID
exports.getSalesById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await sql.query`
            SELECT a.periode, a.member_id, b.member_name, a.tgl_trx, a.tdp,a.tbv FROM SALES_TWA a
            left outer join MEMBER_TWA b on (a.member_ID = b.member_ID)
            WHERE a.member_id = ${id}
        `;


        if (result.recordset.length === 0) {
            throw new AppError("Member tidak ditemukan", 404);
        }

        res.json(result.recordset);
    } catch (err) {
        next(err);
    }
};
