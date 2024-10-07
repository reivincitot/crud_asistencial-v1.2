from django.db import models


class Pais(models.Model):
    nombre_pais = models.CharField(max_length=100, unique=True)
    codigo_pais = models.CharField(
        max_length=3, unique=True, default="+56"
    )

    def __str__(self):
        return f"País: {self.nombre_pais}, Código País: {self.codigo_pais}"

    class Meta:
        verbose_name = "País"
        verbose_name_plural = "Países"


class Region(models.Model):
    nombre_region = models.CharField(max_length=100, unique=True, blank=False)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, null=True)
    codigo_telefonico_region = models.CharField(
        max_length=3, blank=True, null=True, unique=True
    )
    def __str__(self):
        return f" Nombre de la Región: {self.nombre_region}, Código telefónico de la Región: {self.codigo_telefonico_region}"

    class Meta:
        verbose_name = "Región"
        verbose_name_plural = "Región"


class Provincia(models.Model):
    nombre_provincia = models.CharField(
        max_length=100, unique=True, blank=True, null=True
    )
    
    region = models.ForeignKey(Region, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.region}, Provincia: {self.nombre_provincia}"

    class Meta:
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"


class Comuna(models.Model):
    nombre_comuna = models.CharField(max_length=100, unique=True, blank=False)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_comuna}, {self.region}"

    class Meta:
        verbose_name = "Comuna"
        verbose_name_plural = "Comunas"


class Ciudad(models.Model):
    nombre_ciudad = models.CharField(max_length=100, unique=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.region}, {self.nombre_ciudad}"

    class Meta:
        verbose_name = "Ciudad"
        verbose_name_plural = "Ciudades"
