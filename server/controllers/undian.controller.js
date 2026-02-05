const { pool, sql } = require("../db");

/** Combo box hadiah */
exports.getHadiah = async (req, res) => {
  try {
    const result = await pool.request().query(
      "SELECT * FROM TWA_UNDIANHADIAH"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
};


/** Nomor undian yg belum pernah menang */
exports.getNomorTersedia = async (req, res) => {
    //const p = await pool;
    const result = await pool.request().query(`
        SELECT NomorUndian, Nama
        FROM TWA_UNDIAN_NOMOR
        WHERE NomorUndian NOT IN (
            SELECT NomorUndian FROM TWA_UNDIANHASIL
        )
    `);
    res.json(result.recordset);
};

/** Cek hasil hadiah tertentu */
exports.getHasilByHadiah = async (req, res) => {
    const { nomorHadiah } = req.params;
    //const p = await pool;

    const result = await pool.request()
        .input("nomorHadiah", sql.VarChar, nomorHadiah)
        .query(`
            SELECT * FROM TWA_UNDIANHASIL
            WHERE NomorHadiah = @nomorHadiah
        `);

    res.json(result.recordset);
};

/** Simpan hasil undian */
exports.simpanHasil = async (req, res) => {
    const { nomorHadiah, winners } = req.body;
    //const p = await pool;

    for (const w of winners) {
        await pool.request()
            .input("NomorUndian", sql.VarChar, w.NomorUndian)
            .input("Nama", sql.VarChar, w.Nama)
            .input("NomorHadiah", sql.VarChar, nomorHadiah)
            .query(`
                INSERT INTO TWA_UNDIANHASIL
                VALUES (@NomorUndian, @Nama, @NomorHadiah)
            `);
    }
    res.json({ success: true });
};

/** RESET */
exports.resetHasil = async (req, res) => {
    //const p = await pool;
    await pool.request().query("DELETE FROM TWA_UNDIANHASIL");
    res.json({ success: true });
};