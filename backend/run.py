import os
from app import create_app, socketio
from app.sockets import events  # noqa: F401 — registers socket handlers

app = create_app(os.getenv("FLASK_ENV", "development"))

if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=5001,
        debug=True,
        use_reloader=False,
        allow_unsafe_werkzeug=True,
    )
