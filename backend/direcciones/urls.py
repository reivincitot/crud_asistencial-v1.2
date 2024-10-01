from rest_framework.routers import DefaultRouter
from .views import PaisViewSet, RegionViewSet, ComunaViewSet, CiudadViewSet, DireccionViewSet, ProvinciaViewSet

router = DefaultRouter()
router.register(r'paises', PaisViewSet)
router.register(r'region', RegionViewSet)
router.register(r'provincia', ProvinciaViewSet)
router.register(r'comuna', ComunaViewSet)
router.register(r'ciudad', CiudadViewSet)
router.register(r'direccion', DireccionViewSet)

urlpatterns = router.urls