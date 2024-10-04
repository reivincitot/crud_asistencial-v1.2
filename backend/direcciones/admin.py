from django.contrib import admin
from .models import Pais, Region, Comuna, Ciudad, Provincia

class PaisAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_pais', 'codigo_pais')

class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_region', 'pais')

class ProvinciaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_provincia', 'codigo_telefonico_provincia', 'region')

class ComunaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_comuna', 'region')

class CiudadAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_ciudad', 'region')



# Registro de los modelos en el admin
admin.site.register(Pais, PaisAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Provincia, ProvinciaAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(Ciudad, CiudadAdmin)
