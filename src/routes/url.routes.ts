import {Router} from "express";
import { createUrl, deleteUrl, getOriginalUrl, updateUrl, getStats } from "../controllers/url.controller"

const router = Router();

router.post("/", createUrl);
router.get("/:shortCode", getOriginalUrl);
router.put("/:shortCode", updateUrl);
router.delete("/:shortCode", deleteUrl);
router.get("/:shortCode/stats", getStats)

export default router;