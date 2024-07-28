from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, UserRegistrationView, UserViewSet , CheckLoginStatusView 

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'users', UserViewSet, basename='user') 

urlpatterns = [
    path('', include(router.urls)), 
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/check/', CheckLoginStatusView.as_view(), name='check-login-status'),

    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
]
