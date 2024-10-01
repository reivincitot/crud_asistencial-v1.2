from rest_framework import serializers
from .models import Pais, Region, Comuna, Ciudad, Direccion, Provincia


class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class ProvinciaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = '__all__'

class ComunaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Comuna
        fields = '__all__'

class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields = '__all__'


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'
