from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, UserRegistrationView, UserViewSet  

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'users', UserViewSet, basename='user') 

urlpatterns = [
    path('', include(router.urls)), 
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/register/', UserRegistrationView.as_view(), name='user-register'),
]
