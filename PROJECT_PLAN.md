# Mama's 60th Birthday Website - Project Plan

## Project Overview

A mobile-first, single-page React website celebrating Mom's 60th birthday. The gift reveal includes a flight ticket to Japan and unlimited sushi for a 2027 trip. The site features scroll-triggered 3D animations with Japanese-inspired aesthetics.

**Target Language:** German  
**Deployment:** GitHub Pages  
**Design Philosophy:** Mobile-first, Japanese aesthetics (sakura, minimalism)

---

## AI Agent Instructions

### Context for Continuation

This project was planned in a previous conversation. The user wants a beautiful birthday website with:

1. **3D Flight Ticket** - Rotates/flips as user scrolls (using GSAP ScrollTrigger with CSS 3D transforms)
2. **3D Stylized Sushi** - Cartoon-style nigiri that rotates on scroll (using React Three Fiber)
3. **Birthday Wishes Section** - 3-5 family messages with fade-in animations
4. **Background Music** - Toggle for ambient Japanese music
5. **Cherry Blossom Effects** - Floating petals in hero section

### Key Decisions Already Made

| Decision | Choice |
|----------|--------|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| 3D Ticket Animation | GSAP + ScrollTrigger (CSS 3D transforms) |
| 3D Sushi Model | React Three Fiber + drei (stylized/cartoon) |
| UI Animations | Framer Motion |
| Language | German |
| Photos | Not included initially, but structure should allow easy addition |
| Hosting | GitHub Pages |

### Implementation Priority

Work through these phases in order:

1. **Phase 1: Project Setup** - Get the foundation running
2. **Phase 2: Core Components** - Build each section
3. **Phase 3: Styling & Polish** - Make it beautiful
4. **Phase 4: Deployment** - Ship to GitHub Pages

---

## Technical Specifications

### Tech Stack

```
react: ^18.x
vite: ^5.x
tailwindcss: ^3.x
gsap: ^3.x (with ScrollTrigger plugin)
@react-three/fiber: ^8.x
@react-three/drei: ^9.x
framer-motion: ^11.x
gh-pages: ^6.x
```

### Project Structure

```
mama-60/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Hero.jsx              # Welcome section with cherry blossoms
│   │   ├── FlightTicket.jsx      # 3D rotating ticket (GSAP)
│   │   ├── SushiReveal.jsx       # 3D sushi model (R3F)
│   │   ├── BirthdayWishes.jsx    # Family messages
│   │   ├── MusicToggle.jsx       # Audio control
│   │   └── CherryBlossoms.jsx    # Floating petal animation
│   ├── assets/
│   │   ├── music/                # Ambient Japanese track (.mp3)
│   │   ├── models/               # 3D sushi model (.glb)
│   │   └── images/               # Textures, patterns, future photos
│   └── data/
│       └── wishes.js             # Birthday message content
└── public/
    └── favicon.ico
```

### Color Palette (Tailwind Config)

```javascript
// Add to tailwind.config.js
colors: {
  sakura: {
    pink: '#FFB7C5',
    light: '#FFF0F3',
    dark: '#E89AAE',
  },
  gold: {
    accent: '#D4AF37',
    light: '#F4E4BA',
  },
  charcoal: '#2D2D2D',
  cream: '#FFFEF9',
}
```

### Typography

- **Headings:** Use a clean serif or elegant sans-serif (consider: `Noto Serif JP`, `Playfair Display`)
- **Body:** Clean sans-serif (`Inter`, `Noto Sans`)
- **All text in German**

---

## Component Specifications

### 1. Hero.jsx

**Purpose:** Welcome section with birthday message and floating cherry blossoms.

**Content (German):**
```
Heading: "Alles Gute zum 60. Geburtstag!"
Subheading: "Für die beste Mama der Welt"
Call to action: "Scrolle nach unten für deine Überraschung"
```

**Features:**
- Full viewport height on mobile
- CherryBlossoms component overlay
- Subtle scroll indicator animation

### 2. FlightTicket.jsx

**Purpose:** 3D animated flight ticket that reveals the Japan trip gift.

**Animation Behavior:**
- Starts flat/angled
- Rotates and flips as user scrolls through section
- Uses GSAP ScrollTrigger with `scrub: 1` for smooth scroll-linking
- CSS 3D transforms: `rotateY`, `rotateX`, `perspective`

**Ticket Content (German):**
```
Airline: "Geburtstagsflug"
From: "[Home City]" → To: "Tokyo, Japan"
Passenger: "Mama"
Date: "2027"
Class: "First Class" oder "Premium"
Note: "Reise nach Japan - Dein Geschenk!"
```

**Implementation Hint:**
```jsx
// Use GSAP ScrollTrigger
gsap.to('.ticket', {
  rotateY: 360,
  rotateX: 15,
  scrollTrigger: {
    trigger: '.ticket-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,
  }
})
```

### 3. SushiReveal.jsx

**Purpose:** 3D stylized sushi that rotates into view, representing unlimited sushi gift.

**Style:** Cartoon/stylized nigiri (not photorealistic)

**Animation Behavior:**
- Sushi model rotates based on scroll position
- Uses React Three Fiber with useFrame and scroll-linked rotation
- Consider: Simple geometric sushi if no .glb model (box + cylinder shapes)

**Text Overlay (German):**
```
"Unbegrenztes Sushi"
"Für deine Japan-Reise 2027"
```

**Implementation Options:**
1. **With 3D Model:** Load a .glb file from Sketchfab (free) or create simple one
2. **Procedural:** Build simple sushi from R3F primitives (easier, smaller bundle):
   ```jsx
   // Rice base (rounded box)
   // Fish topping (curved shape)
   // Simple materials with cartoon shading
   ```

### 4. BirthdayWishes.jsx

**Purpose:** Display 3-5 birthday messages from family members.

**Data Structure:**
```javascript
// src/data/wishes.js
export const wishes = [
  {
    id: 1,
    name: "Name",
    relation: "Sohn/Tochter", // Son/Daughter
    message: "Liebe Mama, ...",
  },
  // ... more wishes
]
```

**Animation:** Cards fade in and slide up on scroll (Framer Motion `whileInView`)

**Design:** 
- Card layout with subtle shadow
- Japanese-inspired border or accent
- Responsive grid (1 col mobile, 2 col tablet+)

### 5. MusicToggle.jsx

**Purpose:** Fixed button to toggle ambient Japanese music.

**Features:**
- Fixed position (bottom-right corner)
- Clear play/pause icon
- Starts muted (user must opt-in)
- Remembers state during session

**Music Suggestion:** 
- Traditional Japanese ambient (koto, shamisen)
- Royalty-free from: Pixabay, Free Music Archive
- Keep file small (<2MB)

### 6. CherryBlossoms.jsx

**Purpose:** Floating sakura petal animation overlay for hero section.

**Implementation Options:**
1. **CSS Animation:** Multiple petal divs with keyframe animations
2. **Canvas:** Lightweight particle system
3. **Framer Motion:** Animated divs with random paths

**Performance:** Limit to 15-20 petals, pause when not in viewport

---

## Scroll Flow (User Journey)

```
[Start]
    ↓
[Hero Section] - "Alles Gute zum 60. Geburtstag!"
    ↓ (scroll)
[Flight Ticket Section] - 3D ticket rotates into view
    ↓ (scroll)  
[Sushi Section] - 3D sushi rotates, "Unbegrenztes Sushi"
    ↓ (scroll)
[Birthday Wishes] - Family messages fade in
    ↓
[Footer] - Simple closing message
```

---

## Mobile-First Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

**Key Mobile Considerations:**
- Touch-friendly (no hover-dependent interactions)
- 3D performance: Reduce polygon count, use lower resolution textures
- Test on real devices if possible
- Minimum touch target: 44x44px

---

## GitHub Pages Deployment

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mama-60/', // Repository name
})
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### Deployment Steps

1. `npm run build` - Create production build
2. `npm run deploy` - Push to gh-pages branch
3. Enable GitHub Pages in repo settings (source: gh-pages branch)

---

## Assets to Source/Create

| Asset | Type | Source Suggestion |
|-------|------|-------------------|
| Sushi 3D Model | .glb | Sketchfab (free), or build procedurally |
| Background Music | .mp3 | Pixabay, Free Music Archive |
| Cherry Blossom Petal | .svg/.png | Create simple shape or find free asset |
| Japanese Pattern (seigaiha) | .svg | SVG pattern generator |
| Fonts | Google Fonts | Noto Serif JP, Inter |

---

## Content Placeholders (German)

### Hero Section
```
Hauptüberschrift: "Alles Gute zum 60. Geburtstag!"
Unterüberschrift: "Für die beste Mama der Welt"
Scroll-Hinweis: "Scrolle nach unten für deine Überraschung ↓"
```

### Flight Ticket Section
```
Einleitung: "Dein Geschenk wartet..."
Ticket-Details:
  - Fluglinie: "Birthday Airlines"
  - Von: "[Heimatstadt]"
  - Nach: "Tokyo, Japan"
  - Passagier: "Mama"
  - Datum: "2027"
  - Klasse: "First Class"
Nachricht: "Eine Reise nach Japan - nur für dich!"
```

### Sushi Section
```
Überschrift: "Und das ist noch nicht alles..."
Highlight: "Unbegrenztes Sushi"
Details: "Genieße so viel Sushi wie du möchtest während deiner Japan-Reise 2027"
```

### Wishes Section
```
Überschrift: "Liebe Grüße von deiner Familie"
[Individual messages to be filled in by user]
```

### Footer
```
"Mit ganz viel Liebe, deine Familie"
"60 Jahre voller wunderbarer Erinnerungen"
```

---

## Testing Checklist

- [ ] Mobile viewport (375px) looks correct
- [ ] Tablet viewport (768px) looks correct
- [ ] Desktop viewport (1280px+) looks correct
- [ ] 3D animations perform smoothly on mobile
- [ ] Music toggle works correctly
- [ ] All German text displays properly (umlauts: ä, ö, ü, ß)
- [ ] Scroll animations trigger at correct positions
- [ ] GitHub Pages deployment works
- [ ] Page loads in <3 seconds on 3G

---

## Notes for AI Agents

1. **Start with Phase 1** - Get the project running first before adding features
2. **Test frequently** - Run `npm run dev` and check the browser
3. **Mobile-first** - Always design for mobile viewport first, then scale up
4. **Performance matters** - The 3D elements should not lag on mobile
5. **German content** - All user-facing text must be in German
6. **Keep it elegant** - Japanese aesthetics = minimalism, subtle animations, not flashy
7. **Placeholder for photos** - Structure should allow adding images to `/src/assets/images/` later
8. **The user's mom turns 60** - This is a heartfelt gift, make it special!

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

*Last Updated: February 2026*
*Original Planning Session: Complete*
