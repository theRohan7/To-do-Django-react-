from django.urls import path
from .views import RegisterView, CreateTaskView, UpdateTaskView, DeleteTaskView, TaskListView, TaskDetailView, LoginView

app_name = 'todo_app'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
     path('login/', LoginView.as_view(), name='login'),
    path('tasks/', TaskListView.as_view(), name='task_list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
    path('tasks/create/', CreateTaskView.as_view(), name='create_task'),
    path('tasks/<int:pk>/update/', UpdateTaskView.as_view(), name='update_task'),
    path('tasks/<int:pk>/delete/', DeleteTaskView.as_view(), name='delete_task'),
]