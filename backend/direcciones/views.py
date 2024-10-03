from rest_framework import viewsets
from .models import Pais, Region, Comuna, Ciudad, Direccion, Provincia
from .serializers import PaisSerializer, RegionSerializer, ComunaSerializers, CiudadSerializer, DireccionSerializer, ProvinciaSerializers
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [AllowAny]

class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializers
    permission_classes = [AllowAny]

class ComunaViewSet(viewsets.ModelViewSet):
    queryset = Comuna.objects.all()
    serializer_class = ComunaSerializers
    permission_classes = [AllowAny]

class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer
    permission_classes = [AllowAny]

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    permission_classes = [AllowAny]

def test_connection(request):
    return JsonResponse({"message": "Connected successfully!"})