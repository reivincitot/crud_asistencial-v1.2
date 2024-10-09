from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Pais, Region, Comuna, Ciudad, Provincia
from .serializers import (
    PaisSerializer,
    RegionSerializer,
    ComunaSerializers,
    CiudadSerializer,
    ProvinciaSerializers,
)
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.db import IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'detail': 'Este País o Código ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

class RegionViewSet(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pais_id = request.query_params.get('pais')
        if pais_id:
            regiones = Region.objects.filter(pais__id=pais_id)
        else:
            regiones = Region.objects.all()
        serializer = RegionSerializer(regiones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RegionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProvinciaViewSet(APIView):
    permission_classes=[AllowAny]

    def get(self, request):
        region_id = request.query_params.get('region')
        if region_id:
            provincias = Provincia.objects.filter(region__id=region_id)
        else:
            provincias = Provincia.objects.all()
        serializer = ProvinciaSerializers(provincias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProvinciaSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComunaViewSet(APIView):
    permission_classes=[AllowAny]

    def get(self, request):
        provincia_id = request.query_params.get('provincia')
        if provincia_id:
            comuna = Comuna.objects.filter(provincia__id=provincia_id)
        else:
            comunas = Comuna.objects.all()
        serializers = ComunaSerializers(comunas, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ComunaSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CiudadViewSet(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        provincia_id = request.query_params.get('provincia')

        if provincia_id:
            ciudades = Ciudad.objects.filter(provincia__id=provincia_id)
        ciudades = Ciudad.objects.all()
        serializers = CiudadSerializer(ciudades, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializers = CiudadSerializer(data=request.data)
        if serializers.is_valid():
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


def test_connection(request):
    return JsonResponse({"message": "Connected successfully!"})

@api_view(['POST'])
def verificar_existencia(request):
    modelo = request.data.get('modelo') 
    campo = request.data.get('campo')
    valor = request.data.get('valor')

    # Validar que se recibieron todos los datos
    if not modelo or not campo or not valor:
        return Response({'error': 'Datos incompletos'}, status=400)
    
    # verificar si existe el duplicado
    if verificar_existencia(modelo, campo, valor):
        return Response({'exists': True, 'nombre':valor})

    return Response({'exists':False})