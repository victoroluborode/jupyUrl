import {Router} from "express";
import { createUrl, getOriginalUrl } from "../controllers/url.controller"

const router = Router();

router.post("/", createUrl);
router.get("/:shortCode", getOriginalUrl);

export default router;