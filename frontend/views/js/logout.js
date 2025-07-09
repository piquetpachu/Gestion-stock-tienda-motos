document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/Gestion-stock-tienda-motos/app/logout', {
            method: 'POST',
            credentials: 'include' // Importante para enviar cookies
        });
        
        if (!response.ok) throw new Error('Error en la respuesta');
        
        // Forzar recarga para limpiar estado de la aplicación
        window.location.replace('login.html');
        
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo cerrar sesión. Intenta recargar la página.');
    }
});