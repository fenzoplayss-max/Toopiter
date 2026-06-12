"""
Core views for Toopiter.
Includes error handlers and utility views.
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render


@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring"""
    return Response({
        'status': 'healthy',
        'service': 'toopiter-api'
    })


def error_404(request, exception):
    """Custom 404 error handler"""
    if request.path.startswith('/api/'):
        from rest_framework.response import Response
        return Response(
            {'error': 'Resource not found', 'code': 404},
            status=404
        )
    return render(request, 'errors/404.html', status=404)


def error_500(request):
    """Custom 500 error handler"""
    if request.path.startswith('/api/'):
        from rest_framework.response import Response
        return Response(
            {'error': 'Internal server error', 'code': 500},
            status=500
        )
    return render(request, 'errors/500.html', status=500)
