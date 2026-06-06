import os
from app import create_app, socketio
from app.sockets import events  # noqa: F401

app = create_app(os.getenv("FLASK_ENV", "production"))

if __name__ == "__main__":
    # Railway asigna PORT automáticamente; localmente usamos 5001
    port = int(os.getenv("PORT", 5001))
    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=os.getenv("FLASK_ENV") == "development",
        use_reloader=False,
        allow_unsafe_werkzeug=True,
    )
