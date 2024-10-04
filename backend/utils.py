from datetime import date
from django.shortcuts import render
from rest_framework import serializers
import re


def calcular_edad(fecha_de_nacimiento):
    today = date.today()
    age = today.year - fecha_de_nacimiento.year
    if (today.month, today.day) < (fecha_de_nacimiento.month, fecha_de_nacimiento.day):
        age -= 1
    return age

def save_con_edad(instance, *args, **kwargs):
    instance.edad = calcular_edad(instance.fecha_de_nacimiento)
    super(instance.__class__, instance).save(*args, **kwargs)

def manejar_formulario(request, form_class, template_name):
    """
    Maneja el procesamiento y redirección de un formulario en una vista genérica.
    
    Args:
        request: El objeto HttpRequest.
        form_class: La clase del formulario que se va a procesar.
        template_name: El nombre del template donde se mostrará el formulario.
        continuar_url: La URL o vista para redirigir cuando el botón 'guardar y continuar' es presionado.
    
    Returns:
        La renderización del formulario o la redirección dependiendo del resultado.
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
    """Valida que el nombre no tenga espacios al inicio o al final y solo contenga letras y espacios en el medio"""
    
    value=value.strip() # Elimina espacios al principio y al final
    
    if not re.match(r'^[a-zA-Z\s]+$', value): # Solo letras y espacios
        raise serializers.ValidationError("El nombre solo puede contener letras y espacios.")
    return value

def validate_existe(data, key, context, model):
    """Valida que se haya seleccionado un campo específico y que no haya duplicados en la base de datos.
    
    Args:
        data: Los datos del serializer.
        key: La clave del campo a validar.
        context: Mensaje contextual que se mostrará si falla la validación.
        model: El modelo que se usará para verificar duplicados.
        
    Returns:
        Los datos sin cambios si la validación pasa.
        
    Raises:
        serializers.ValidationError si la validación falla.
    """
    value = data.get(key)

    # Si el valor está vacío, significa que el usuario está creando un nuevo registro
    if not value:
        raise serializers.ValidationError(f"Debes seleccionar {context} para crear esta entrada.")
    
    # Verificación de duplicados si el valor no es None o vacío
    if model.objects.filter(nombre=value).exists():
        raise serializers.ValidationError(f"Ya existe un registro con el nombre '{value}' en la base de datos.")
    
    return data
