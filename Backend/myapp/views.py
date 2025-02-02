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
from rest_framework.views import APIView


class CheckLoginStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"logged_in": True})
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

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def pending_requests(self, request):
        user = request.user
        pending_requests = Contact.objects.filter(contact=user, accepted=False)
        serializer = self.get_serializer(pending_requests, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = self.request.user
        contact_user = serializer.validated_data['contact']

        existing_contact = Contact.objects.filter(
            Q(user=user, contact=contact_user) | Q(user=contact_user, contact=user)
        ).first()

        if existing_contact:
            if not existing_contact.accepted:
                existing_contact.accepted = True
                existing_contact.save(update_fields=['accepted'])
        else:
            serializer.save(user=user)

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

            Contact.objects.create(user=user, contact=contact_user)
            return Response({'status': 'Contact request sent.'})
        except User.DoesNotExist:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def accept_request(self, request):
        user = request.user
        contact_username = request.data.get('username')
        try:
            contact_user = User.objects.get(username=contact_username)
            contact_request = Contact.objects.get(user=contact_user, contact=user)
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