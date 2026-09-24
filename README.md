# SENQUARA — Full Responsive Media Studio

A responsive React/Vite implementation of the requested SENQUARA workflow:

- Google/Gmail-style login entry + manual registration UI
- User dashboard
- Admin users dashboard
- Approximate IP/location concept and live map UI
- Single/multiple image & video selection
- Touch-oriented editor UI
- Image duration controls
- Text, rotate, zoom, crop/tool controls
- Music upload + browser preview
- Replay/loop controls
- Image resize
- Batch image compression
- Responsive mobile/tablet/desktop layout
- WebSocket relay server starter

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

For the relay server:

```bash
npm run server
```

It listens on port 8787 by default.

## Production work still required

This package is a complete responsive frontend/starter implementation, but production authentication, persistent database storage, secure sessions, Google OAuth client configuration, server-side media transcoding, authorization, and real IP geolocation must be connected to your backend.

IP location is approximate and must not be presented as exact GPS. Exact device location should only be collected with explicit permission.

The browser compressor uses Canvas and outputs JPEG. Browser decoding of GIF/BMP/HEIC/RAW/etc. varies; a production universal converter should use a server-side media pipeline such as FFmpeg/ImageMagick/libvips where legally and operationally appropriate.
