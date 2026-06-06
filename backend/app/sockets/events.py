from app import socketio
from flask_socketio import emit, join_room


@socketio.on("connect")
def on_connect():
    emit("connected", {"message": "Conectado al servidor RCM"})


@socketio.on("join")
def on_join(data):
    room = data.get("room", "general")
    join_room(room)
    emit("joined", {"room": room})


@socketio.on("disconnect")
def on_disconnect():
    pass
