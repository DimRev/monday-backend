import { loggerService } from "../service/logger.service.js"

export async function log(req, res, next) {
    loggerService.info('Req was made', req.route.path)
    next()
}