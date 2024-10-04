from rest_framework.routers import DefaultRouter
from .views import (
    PaisViewSet,
    RegionViewSet,
    ComunaViewSet,
    CiudadViewSet,
    ProvinciaViewSet,
)
from django.urls import path
from . import views


router = DefaultRouter()
router.register(r"paises", PaisViewSet)


urlpatterns = [
    path("test/", views.test_connection, name="test_connection"),
    path('region/', RegionViewSet.as_view(), name='region-list'),
    path('provincia/', ProvinciaViewSet.as_view(), name='provincia-list'),
    path('comuna/', ComunaViewSet.as_view(), name='comuna-list'),
    path('ciudad/', CiudadViewSet.as_view(), name='ciudad-list'),
]

urlpatterns += router.urls
