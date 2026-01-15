import express from "express"
import { secureRoute } from "../middleware/secureRoute.js"
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification
} from "../controller/notification.controller.js"

const notificationRoute = express.Router()

notificationRoute.get('/get-user-notification/:user_id', secureRoute, getUserNotifications)
notificationRoute.patch('/mark-as-read/:notification_id', secureRoute, markNotificationAsRead)
notificationRoute.patch('/mark-all-as-read', secureRoute, markAllAsRead)
notificationRoute.delete('/delete/:notification_id', secureRoute, deleteNotification)

export default notificationRoute