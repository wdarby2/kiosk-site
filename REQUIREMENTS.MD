# Senior Thesis Kiosk Site — Technical Requirements

## Purpose

Create an **offline website** to display **20 motion study sprite videos** as part of a digital gallery installation.
The site will run on a **27" iMac** in **Chrome kiosk mode**, designed for **smooth**, **immersive**, **motion-design-forward** experience.

---

## Home Page Layout

- **4 rows × 5 columns** grid layout (20 total sprites).
- **Each sprite is a playing video thumbnail** (no audio).
- **Rounded rectangle shape** for thumbnails (soft, gallery-style edges).
- **Hover effect**: Subtle scale-up or highlight to indicate interactivity.
- **Click behavior**: Clicking a thumbnail navigates to that sprite's individual page.

---

## Individual Sprite Pages

- Full-page **video player** that plays the selected motion study.
- Prominently display:
  - **Sprite title**.
  - **Genre of music**.
  - **Song title**.
  - **Animation methods** (software/tools/techniques used).
- **Manual "Back" Button** to return to home page immediately.
- **Auto-redirect** back to home page after **10 seconds of inactivity** (no clicks or mouse movement).

---

## Design & Visual Style

- **Clean, minimal, immersive** — motion-focused digital gallery aesthetic.
- **Smooth transitions** between pages (e.g., fade or slide effects).
- **Responsive layout** optimized for a **27" iMac** at full screen resolution.
- **TailwindCSS** will be used for styling (utility-first, no heavy custom CSS needed).

---

## Functionality & Performance

- **All assets must be local** (no external servers, fonts, videos, or libraries).
- **Offline capable**: App must run entirely from local filesystem (`file://` URLs).
- **All videos preloaded by natural usage**:
  - Home page thumbnails are already playing (no additional preload logic needed).
  - Navigation to individual sprite pages will feel instant due to caching.
- **Memory requirements**:
  - Must account for ~20 playing videos simultaneously.
  - Target device (iMac) must have sufficient RAM and SSD storage.

---

## Stack and Technology

| Layer        | Technology      | Notes                                     |
| :----------- | :-------------- | :---------------------------------------- |
| Build Tool   | **Vite**        | Fast local dev server + production build. |
| Language     | **TypeScript**  | Safer coding, stricter typing.            |
| UI Framework | **React**       | State management, conditional rendering.  |
| Styling      | **TailwindCSS** | Quick, clean layout and effects.          |

---

## Additional Technical Details

- Smooth hover and click interactions should feel lightweight and immediate.
- Video elements must use:
  - `muted`
  - `playsInline`
  - `autoplay`
  - `loop`
- Full-page video views must maintain **object-fit: cover** behavior to always fill screen cleanly.
- "Back" button should be unobtrusive but accessible during video playback.
- Ensure that navigating to and from sprite pages **fully resets timers and view state**.

---

# ✅ This version includes:

- Your original requirements
- Pre-agreed mandatory updates:
  - **Manual Back Button** on sprite pages
  - **TailwindCSS** for styling
- Clarifications about **video preloading** (naturally achieved via home thumbnails)
- No unexpected loading screens
- No routing complexity beyond basic page navigation
