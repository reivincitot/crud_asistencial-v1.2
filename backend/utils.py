from datetime import date
from django.shortcuts import render #,redirect


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


