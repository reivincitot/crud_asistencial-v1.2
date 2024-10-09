from rest_framework import serializers
from .models import Pais, Region, Comuna, Ciudad, Provincia 
from utils import validate_existe, validate_nombre


class PaisSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Pais.

    Este serializador maneja la validación de la creación y actualización de objetos del modelo Pais.
    Valida que el nombre del país no exista previamente y que el código del país no esté vacío.

    Campos:
        - '__all__': Se incluyen todos los campos del modelo Pais.

    Validaciones:
        - validate: Verifica que el nombre del país no esté duplicado y que el código del país no esté vacío.
    """

    class Meta:
        model = Pais
        fields = '__all__'

    def validate(self, attrs):
        """ Verificar si el nombre del país ya existe """
        if 'nombre_pais' in attrs:
            if Pais.objects.filter(nombre_pais=attrs['nombre_pais']).exists():
                raise serializers.ValidationError("Este país ya existe.")
            
        """ Verificar si el código del país no está vacío """
        if 'codigo_pais' not in attrs or attrs['codigo_pais'] == '':
            raise serializers.ValidationError("El código del país no puede estar vacío.")
        return attrs



class RegionSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Region.

    Este serializador maneja la validación de la creación y actualización de objetos del modelo Region.
    Aplica validaciones para el nombre de la región y la existencia de una región con el mismo nombre.

    Campos:
        - '__all__': Se incluyen todos los campos del modelo Region.

    Validaciones:
        - validate_nombre: Aplica la validación personalizada para el nombre de la región.
        - validate: Aplica la validación de existencia, verificando si ya existe una región con el mismo nombre.
    """

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
    """
    Serializador para el modelo Provincia.

    Este serializador maneja la validación de la creación y actualización de objetos del modelo Provincia.
    Aplica validaciones para el nombre de la provincia y la existencia de una provincia con el mismo nombre.

    Campos:
        - '__all__': Se incluyen todos los campos del modelo Provincia.

    Validaciones:
        - validate_nombre: Aplica la validación personalizada para el nombre de la provincia.
        - validate: Aplica la validación de existencia, verificando si ya existe una provincia con el mismo nombre.
    """

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
    """
    Serializador para el modelo Comuna.

    Este serializador maneja la validación de la creación y actualización de objetos del modelo Comuna.
    Aplica validaciones para el nombre de la comuna y la existencia de una comuna con el mismo nombre.

    Campos:
        - '__all__': Se incluyen todos los campos del modelo Comuna.

    Validaciones:
        - validate_nombre: Aplica la validación personalizada para el nombre de la comuna.
        - validate: Aplica la validación de existencia, verificando si ya existe una comuna con el mismo nombre.
    """
    class Meta:
        model = Comuna
        fields = '__all__'

    def validate_nombre(self, value):
        """Aplica la validación del nombre para la comuna."""
        return validate_nombre(value)
    
    def validate(self, data):
        """Validación de existencia para la comuna."""
        return validate_existe(data, 'nombre', ' una comuna', Comuna)


class CiudadSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Ciudad.

    Este serializador maneja la validación de la creación y actualización de objetos del modelo Ciudad.
    Aplica validaciones para el nombre de la ciudad y la existencia de una ciudad con el mismo nombre.

    Campos:
        - '__all__': Se incluyen todos los campos del modelo Ciudad.

    Validaciones:
        - validate_nombre: Aplica la validación personalizada para el nombre de la ciudad.
        - validate: Aplica la validación de existencia, verificando si ya existe una ciudad con el mismo nombre.
    """

    class Meta:
        model = Ciudad
        fields = '__all__'

    def validate_nombre(self, value):
        """Aplica la validación del nombre para la ciudad."""
        return validate_nombre(value)
        
    def validate(self, data):
        """Validación de existencia para la ciudad."""
        return validate_existe(data, 'nombre', 'una ciudad', Ciudad)

