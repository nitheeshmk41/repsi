from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.workspaces import router as workspaces_router
from app.api.v1.members import router as members_router
from app.api.v1.memberships import router as memberships_router
from app.api.v1.attendance import router as attendance_router
from app.api.v1.trainers import router as trainers_router
from app.api.v1.classes import router as classes_router
from app.api.v1.workouts import router as workouts_router
from app.api.v1.payments import router as payments_router
from app.api.v1.expenses import router as expenses_router
from app.api.v1.reports import router as reports_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.biometric import router as biometric_router
from app.api.v1.invitations import router as invitations_router
from app.api.v1.superadmin import router as superadmin_router
from app.api.v1.machines import router as machines_router
from app.api.v1.crm import router as crm_router
from app.api.v1.websites import router as websites_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(workspaces_router)
api_router.include_router(members_router)
api_router.include_router(memberships_router)
api_router.include_router(attendance_router)
api_router.include_router(trainers_router)
api_router.include_router(classes_router)
api_router.include_router(workouts_router)
api_router.include_router(payments_router)
api_router.include_router(expenses_router)
api_router.include_router(reports_router)
api_router.include_router(dashboard_router)
api_router.include_router(biometric_router)
api_router.include_router(invitations_router)
api_router.include_router(superadmin_router)
api_router.include_router(machines_router)
api_router.include_router(crm_router)
api_router.include_router(websites_router)

