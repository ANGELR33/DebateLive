# DebateLive

Interfaz React/Vite para crear debates en vivo con sala Jitsi, chat, encuesta y postulaciones.

## Desarrollo local

```bash
npm install
npm run dev
```

## Sincronizacion remota gratis para pruebas

La app funciona sin backend usando `localStorage`. Para probar desde varios dispositivos o navegadores, configura Firestore en Firebase.

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Crea una base Cloud Firestore en modo nativo.
3. Para una prueba rapida, usa reglas abiertas temporalmente:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /debateLive/{document} {
      allow read, write: if true;
    }
  }
}
```

4. Crea una app web en Firebase y copia `apiKey` y `projectId`.
5. En local, copia `.env.example` a `.env` y completa:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

6. En Vercel, agrega esas mismas variables en Project Settings -> Environment Variables.

Con esas variables, DebateLive guarda debates, chat y encuestas en Firestore. Sin ellas, vuelve automaticamente a modo local.

## Notas

- Jitsi gestiona el video remoto.
- Firestore sincroniza el estado de la app cada pocos segundos.
- Las reglas abiertas son solo para pruebas. Antes de produccion hay que agregar autenticacion o reglas mas estrictas.
