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
from rest_framework.decorators import api_view


class PaisViewSet(viewsets.ModelViewSet):
    """
    Vista para manejar las operaciones CRUD del modelo Pais.

    Métodos:
        create(request): Crea un nuevo país, asegurando que el nombre se guarde en minúsculas.
        update(request, *args, **kwargs): Actualiza un país existente, guardando el nombre en minúsculas.
    """

    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Convertir el nombre del país a minúsculas antes de guardar
        request.data['nombre_pais'] = request.data['nombre_pais'].lower()
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'detail': 'Este País o Código ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        # Convertir el nombre del país a minúsculas antes de actualizar
        request.data['nombre_pais'] = request.data['nombre_pais'].lower()
        return super.update(request, *args, **kwargs)

class RegionViewSet(APIView):
    """
    Vista para manejar las operaciones CRUD del modelo Region.

    Métodos:
        get(request): Obtiene una lista de regiones, filtrando por país si se proporciona.
        post(request): Crea una nueva región.
    """

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
            try:
                serializer.save() # Aquí se guarda en minúsculas
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'detail': 'Esta Región ya esta registrada'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProvinciaViewSet(APIView):
    """
    Vista para manejar las operaciones CRUD del modelo Provincia.

    Métodos:
        get(request): Obtiene una lista de provincias, filtrando por región si se proporciona.
        post(request): Crea una nueva provincia.
    """
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
            try:
                serializer.save() # Aquí se guarda en minúsculas
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'detail': 'Esta Provincia ya está registrada.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComunaViewSet(APIView):
    """
    Vista para manejar las operaciones CRUD del modelo Comuna.

    Métodos:
        get(request): Obtiene una lista de comunas, filtrando por provincia si se proporciona.
        post(request): Crea una nueva comuna.
    """
    permission_classes=[AllowAny]

    def get(self, request):
        provincia_id = request.query_params.get('provincia')
        if provincia_id:
            comunas = Comuna.objects.filter(provincia__id=provincia_id)
        else:
            comunas = Comuna.objects.all()
        serializers = ComunaSerializers(comunas, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ComunaSerializers(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'detail':'Esta Comuna ya se encuentra registrada.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CiudadViewSet(APIView):
    """
    Vista para manejar las operaciones CRUD del modelo Ciudad.

    Métodos:
        get(request): Obtiene una lista de ciudades, filtrando por provincia si se proporciona.
        post(request): Crea una nueva ciudad.
    """
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
            try:
                serializers.save() # Aquí se guarda en minúsculas
                return Response(serializers.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'detail':'Esta Ciudad ya está registrada.'}, status=status.HTTP_400_BAD_REQUEST)
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
        return Response({'error': 'Datos incompletos'}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar si existe el duplicado
    model_map = {
        'pais': Pais,
        'region': Region,
        'provincia': Provincia,
        'comuna': Comuna,
        'ciudad': Ciudad,
    }

    if modelo in model_map:
        exists = model_map[modelo].objects.filter(**{campo: valor.lower()}).exists()
        return Response({'exists': exists, 'nombre': valor})

    return Response({'error': 'Modelo no válido'}, status=status.HTTP_400_BAD_REQUEST)
