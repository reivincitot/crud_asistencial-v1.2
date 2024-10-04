from rest_framework import serializers
from .models import Pais, Region, Comuna, Ciudad, Provincia 
from utils import validate_existe, validate_nombre


class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

    def validate(self, attrs):
        if 'nombre_pais' in attrs:
            if Pais.objects.filter(nombre_pais=attrs['nombre_pais']).exists():
                raise serializers.ValidationError("Este país ya existe.")
        if 'codigo_pais' not in attrs or attrs['codigo_pais'] == '':
            raise serializers.ValidationError("El código del país no puede estar vacío.")
        return attrs



class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

        def validate_nombre(self, value):
            """Aplica la validación del nombre para la región."""
            return validate_nombre(value)
        
        def validate(self, data):
            """Validación de existencia para la región."""
            return validate_existe(data, 'nombre', 'una región', Region)
    

class ProvinciaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = '__all__'

    def validate_nombre(self, value):
        """Aplica la validación del nombre para la región."""
        return validate_nombre(value)
    
    def validate(self,data):
        """Validación de existencia par la Provincia"""
        return validate_existe(data, 'nombre', 'una provincia', Provincia)


class ComunaSerializers(serializers.ModelSerializer):
    class Meta:
        model = Comuna
        fields = '__all__'

    def validate_nombre(self, value):
        """Aplica la validación del nombre para la comuna."""
        return validate_nombre(value)
    
    def validate(self, data):
        return validate_existe(data, 'nombre', ' una comuna', Comuna)


class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields = '__all__'

        def validate_nombre(self, value):
            """Aplica la validación del nombre para la ciudad."""
            return validate_nombre(value)
        
        def validate(self, data):
            """Validación de existencia para la ciudad."""
            return validate_existe(data, 'nombre', 'una ciudad', Ciudad)

