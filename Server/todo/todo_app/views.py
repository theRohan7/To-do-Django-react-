from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Task
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, TaskSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = authenticate(username=user.username, password=password)
        if user is None:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        tasks = Task.objects.filter(owner=user)
        task_serializer = TaskSerializer(tasks, many=True)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "tasks": task_serializer.data
            },
            "access": access_token,
            "refresh": refresh_token
        }, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(owner=user)
        task_serializer = TaskSerializer(tasks, many=True)
        
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "tasks": task_serializer.data
            }
        }, status=status.HTTP_200_OK)


class CreateTaskView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class UpdateTaskView(generics.RetrieveUpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
    
class DeleteTaskView(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
    
class TaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

class TaskDetailView(generics.RetrieveAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]  
    
    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

