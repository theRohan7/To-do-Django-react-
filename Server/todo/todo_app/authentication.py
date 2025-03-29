from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed


class VerifyJWT(JWTAuthentication):
    def authenticate(self, request):
       header = self.get_header(request)

       if header is None: 
           return None
       
       raw_token = header.decode('utf-8')

       if not raw_token:
           return None
        
       try:
            validated_token = self.get_validated_token(raw_token) 
            return self.get_user(validated_token), validated_token
       except Exception as e:
            raise AuthenticationFailed(f"Invalid token: {str(e)}")