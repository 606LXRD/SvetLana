from django.db import models

class Adresses(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    square = models.FloatField()
    price = models.FloatField()

