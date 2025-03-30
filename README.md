# TO DO 
Django-based RESTful API for a To-Do application. It provides user authentication using JWT and allows users to create, update, delete, and view tasks using PostgreSQL. React in the frontend with DND feature and user engaging UI.

### BACKEND

#### Features

- User registration and login with JWT authentication.
- Create, update, delete, and view tasks.
- PostgreSQL as the database.
- Protected routes using JWT authentication.

  #### Installation and Setup

  1 Clone the Repository
  ```
  git clone <repo-url>
  cd backend
  ```
  
  
  2 Create and Activate a Virtual Environment
  ```
  python -m venv .venv
  .venv\Scripts\activate
  ```
  
  
  3 Install Dependencies
  ```
  pip install -r requirements.txt
  ```

  4. Set Up Environment Variables
  Create a .env file in the root directory and add:
  ```
  SECRET_KEY=your_django_secret_key
  DEBUG=True
  DATABASE_NAME=your_db_name
  DATABASE_USER=your_db_user
  DATABASE_PASSWORD=your_db_password
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  JWT_SECRET_KEY=your_jwt_secret
  ```

  5. Apply Migrations
    ```
    python manage.py migrate
    ```

  6. Create a Superuser (Optional)
  ```
  python manage.py createsuperuser
  ```

7. Run the Development Server
   ```
   python manage.py runserver
   ```
