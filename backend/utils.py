from datetime import date
from django.shortcuts import render
from rest_framework import serializers
import re
from django.apps import apps

def calcular_edad(fecha_de_nacimiento):
    """
    Calcula la edad a partir de la fecha de nacimiento.

    Args:
        fecha_de_nacimiento (date): La fecha de nacimiento de la persona.
    
    Returns:
        int: La edad calculada en años.
    """
    today = date.today()
    age = today.year - fecha_de_nacimiento.year
    if (today.month, today.day) < (fecha_de_nacimiento.month, fecha_de_nacimiento.day):
        age -= 1
    return age

def save_con_edad(instance, *args, **kwargs):
    """
    Calcula y guarda la edad de una instancia basada en su fecha de nacimiento antes de guardarla en la base de datos.
    
    Este método calcula la edad usando la función `calcular_edad` y luego sobrescribe el método `save` del modelo.

    Args:
        instance: La instancia del modelo que se va a guardar.
        *args: Argumentos adicionales para el método `save`.
        **kwargs: Argumentos de palabra clave adicionales para el método `save`.
    """
    instance.edad = calcular_edad(instance.fecha_de_nacimiento)
    super(instance.__class__, instance).save(*args, **kwargs)

def manejar_formulario(request, form_class, template_name):
    """
    Maneja el procesamiento y la redirección de un formulario en una vista genérica.

    Esta función procesa los datos del formulario enviados por el usuario. Si los datos son válidos, 
    el formulario se guarda y la página se renderiza con un mensaje de éxito. Si hay errores, 
    el formulario se renderiza de nuevo mostrando los errores correspondientes.

    Args:
        request: El objeto HttpRequest que contiene los datos del formulario.
        form_class: La clase del formulario que se va a procesar.
        template_name: El nombre del template donde se mostrará el formulario.
    
    Returns:
        HttpResponse: La renderización del formulario con el resultado de éxito o error.
    """
    if request.method == 'POST':
        form = form_class(request.POST)
        if form.is_valid():
            form.save()
            # Indicamos que el formulario fue exitoso
            return render(request, template_name, {'form': form, 'success': True})
        else:
            # Indicamos que hubo un error
            return render(request, template_name, {'form': form,'success': False})
    else:
        form = form_class()
    return render(request, template_name, {'form': form})


def validate_nombre(value):
    """
    Valida que un nombre no contenga caracteres inválidos y que no tenga espacios al inicio o al final.

    Esta función asegura que el nombre solo contenga letras (mayúsculas y minúsculas) y espacios, 
    eliminando los espacios al inicio y al final del valor.

    Args:
        value (str): El nombre que se va a validar.

    Returns:
        str: El valor validado sin espacios al inicio o al final.

    Raises:
        serializers.ValidationError: Si el valor contiene caracteres inválidos.
    """
    
    value=value.strip() # Elimina espacios al principio y al final
    
    if not re.match(r'^[a-zA-Z\s]+$', value): # Solo letras y espacios
        raise serializers.ValidationError("El nombre solo puede contener letras y espacios.")
    return value


def validate_existe(data, key, context, model):
    """
    Valida la existencia de un campo y verifica que no haya duplicados en la base de datos.

    Esta función se usa para asegurarse de que un valor clave específico no esté vacío 
    y que no exista un duplicado del mismo en la base de datos.

    Args:
        data (dict): Los datos del serializer.
        key (str): El nombre del campo a validar.
        context (str): Contexto para el mensaje de error.
        model (Model): El modelo donde se verificará si el valor ya existe.

    Returns:
        dict: Los datos validados si no hay errores.

    Raises:
        serializers.ValidationError: Si el campo está vacío o si ya existe un registro con el mismo valor.
    """
    value = data.get(key)

    # Si el valor está vacío, significa que el usuario está creando un nuevo registro
    if not value:
        raise serializers.ValidationError(f"Debes seleccionar {context} para crear esta entrada.")
    
    # Verificación de duplicados si el valor no es None o vacío
    if model.objects.filter(nombre=value).exists():
        raise serializers.ValidationError(f"Ya existe un registro con el nombre '{value}' en la base de datos.")
    
    return data

def verificar_duplicado(modelo_nombre, campo, valor):
    """
    Valida la existencia de un campo y verifica que no haya duplicados en la base de datos.

    Esta función se usa para asegurarse de que un valor clave específico no esté vacío 
    y que no exista un duplicado del mismo en la base de datos.

    Args:
        data (dict): Los datos del serializer.
        key (str): El nombre del campo a validar.
        context (str): Contexto para el mensaje de error.
        model (Model): El modelo donde se verificará si el valor ya existe.

    Returns:
        dict: Los datos validados si no hay errores.

    Raises:
        serializers.ValidationError: Si el campo está vacío o si ya existe un registro con el mismo valor.
    """
    # Obtener el model dinámicamente usando el nombre del modelo
    Modelo = apps.get_model('direcciones', modelo_nombre)

    # Verificar di el valor existe en el campo especifico
    filtro ={campo: valor}
    return Modelo.objects.filter(**filtro).exists()
