# REPSI Desktop

The desktop shell is a Tauri 2 application around the Next.js web app.

## Linux prerequisites

Install Rust with rustup, then install the Tauri Linux dependencies:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

Restart the shell after installing Rust so `cargo` is on `PATH`.

## Run in development

From the repository root:

```bash
cd app/desktop
npm run dev
```

This starts the Next.js web app on port 3000 and launches the Tauri window.

Useful checks:

```bash
npm run test       # tauri info, including native prerequisites
npm run web:build  # verifies the desktop web command wiring
```

## Production build

```bash
cd app/desktop
npm run build
```

The packaged Tauri app is a native launcher for the deployed web app. Set `REPSI_DESKTOP_URL` to your production URL when building a release; it defaults to `https://repsi.app`:

```bash
REPSI_DESKTOP_URL=https://repsi.app npm run build
```

This is intentional: the Next.js workspace contains dynamic authenticated routes and must remain server-rendered. Development mode uses the local Next.js server through `devUrl`.
