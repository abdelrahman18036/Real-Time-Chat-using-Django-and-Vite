from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Contact

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ContactSerializer(serializers.ModelSerializer):
    other_party = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = ('id', 'other_party', 'accepted')

    def get_other_party(self, obj):
        request_user = self.context['request'].user
        other_party = obj.get_other_party(request_user)
        return UserSerializer(other_party).data