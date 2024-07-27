from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .serializers import ContactSerializer, UserSerializer
from rest_framework.decorators import action
from django.db.models import Q
from .models import Contact

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Contact.objects.filter(
            Q(user=user) | Q(contact=user),
            accepted=True
        )

    def get_serializer_context(self):
        context = super(ContactViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context



    def perform_create(self, serializer):
    # Automatically set the requesting user as the user when creating a new contact
        user = self.request.user
        contact_user = serializer.validated_data['contact']
        
        # Check if the contact already exists in either direction
        existing_contact = Contact.objects.filter(
            Q(user=user, contact=contact_user) | Q(user=contact_user, contact=user)
        ).first()
        
        if existing_contact:
            # If the contact exists in either direction and is not accepted, accept it
            existing_contact.accepted = True
            existing_contact.save(update_fields=['accepted'])
        else:
            # Otherwise, create a new contact
            serializer.save(user=user, accepted=True)  # Set accepted=True directly if creating upon acceptance

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def send_request(self, request):
        user = request.user
        contact_username = request.data.get('username')
        try:
            contact_user = User.objects.get(username=contact_username)
            existing_contact = Contact.objects.filter(
                Q(user=user, contact=contact_user) | Q(user=contact_user, contact=user)
            ).first()
            
            if existing_contact:
                return Response({'error': 'Contact request already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            
            Contact.objects.create(user=user, contact=contact_user)  # Assume not accepted until accepted by the other party
            return Response({'status': 'Contact request sent.'})
        except User.DoesNotExist:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def accept_request(self, request):
        user = request.user
        contact_username = request.data.get('username')
        try:
            contact_user = User.objects.get(username=contact_username)
            contact_request = Contact.objects.get(
                Q(user=contact_user, contact=user) | Q(user=user, contact=contact_user)
            )
            contact_request.accepted = True
            contact_request.save()
            return Response({'status': 'Contact request accepted.'})
        except (User.DoesNotExist, Contact.DoesNotExist):
            return Response({'error': 'Request does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_contact(self, request):
        user = request.user
        contact_username = request.data.get('username')
        try:
            contact_user = User.objects.get(username=contact_username)
            Contact.objects.filter(
                Q(user=user, contact=contact_user) | Q(user=contact_user, contact=user)
            ).delete()
            return Response({'status': 'Contact removed.'})
        except User.DoesNotExist:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)



class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer