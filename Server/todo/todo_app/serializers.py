from rest_framework import serializers 
from django.contrib.auth.models import User
from .models import Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ['id', 'username', 'email', 'password']


class TaskSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model= Task
        fields= '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields= ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user