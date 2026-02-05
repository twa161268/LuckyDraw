const { pool } = require("../db");

/** Combo box hadiah */
exports.getHadiah = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM twa_undianhadiah"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
};


/** Nomor undian yg belum pernah menang */
exports.getNomorTersedia = async (req, res) => {
    //const p = await pool;
    const result = await pool.query(`
        SELECT nomorundian, nama
        FROM twa_undian_nomor
        WHERE nomorundian NOT IN (
            SELECT nomorundian FROM twa_undianhasil
        )
    `);
    res.json(result.rows);
};

/** Cek hasil hadiah tertentu */
exports.getHasilByHadiah = async (req, res) => {
    const { nomorHadiah } = req.params;
    console.log(nomorHadiah);
    const result = await pool.query(
        `SELECT * FROM twa_undianhasil WHERE nomorhadiah = $1`,
        [nomorHadiah]
    );
    res.json(result.rows);
};

/** Simpan hasil undian */
exports.simpanHasil = async (req, res) => {
    const { nomorHadiah, winners } = req.body;
    //const p = await pool;

    for (const w of winners) {
        await pool.query(
            `INSERT INTO twa_undianhasil (nomorundian, nama, nomorhadiah) VALUES ($1, $2, $3)`,
            [w.nomorundian, w.nama, nomorHadiah]
        );
    }
    res.json({ success: true });
};

/** RESET */
exports.resetHasil = async (req, res) => {
    //const p = await pool;
    await pool.query("DELETE FROM twa_undianhasil");
    res.json({ success: true });
};