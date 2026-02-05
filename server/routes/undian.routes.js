const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/undian.controller");

router.get("/hadiah", ctrl.getHadiah);
router.get("/nomor-tersedia", ctrl.getNomorTersedia);
router.get("/hasil/:nomorHadiah", ctrl.getHasilByHadiah);
router.post("/simpan-hasil", ctrl.simpanHasil);
router.post("/reset", ctrl.resetHasil);

module.exports = router;