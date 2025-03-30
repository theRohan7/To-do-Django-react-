from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):

    TODO = 'To Do'
    IN_PROGRESS = 'In Progress'
    COMPLETED = 'Completed'

    CATEGORY_CHOICES = [
        (TODO, 'To do'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETED, 'Completed'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default=TODO,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
