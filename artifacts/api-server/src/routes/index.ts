import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import tenantsRouter from "./tenants";
import brandsRouter from "./brands";
import personasRouter from "./personas";
import campaignsRouter from "./campaigns";
import copyAssetsRouter from "./copyAssets";
import calendarItemsRouter from "./calendarItems";
import dashboardRouter from "./dashboard";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(tenantsRouter);
router.use(brandsRouter);
router.use(personasRouter);
router.use(campaignsRouter);
router.use(copyAssetsRouter);
router.use(calendarItemsRouter);
router.use(dashboardRouter);
router.use(aiRouter);

export default router;
