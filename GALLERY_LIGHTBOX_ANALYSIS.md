# ULTRA ANALÝZA GALÉRIE LIGHTBOX - KOMPLETNÁ DOKUMENTÁCIA

## SÚHRN PROBLÉMU

Lightbox galérie je kompletne nefunkčný po pokusoch o opravu. Hlavné problémy:
- Navbar je stále viditeľný pri otvorenom lightboxe
- Like a download ikony v pravom dolnom rohu nie sú viditeľné
- Tmavé pozadie nepokrýva celú obrazovku správne
- Funkčnosť sa zhoršila namiesto zlepšenia

## TECHNICKÁ ANALÝZA KÓDU

### 1. AKTUÁLNY STAV GALLERY-LIGHTBOX.TSX

```typescript
// Hlavný kontajner lightboxu (riadok 88)
<div className="fixed top-0 left-0 w-full h-full z-[999999] bg-black/95 flex items-center justify-center" onClick={onClose}>
```

**IDENTIFIKOVANÉ PROBLÉMY:**

1. **Z-INDEX KONFLIKT**: 
   - Lightbox: `z-[999999]`  
   - Navbar: `z-50` (v navbar.tsx:27)
   - **ZÁVĚR**: Z-index lightboxu je dostatočne vysoký, problém nie je tu

2. **POZICIONOVANIE**:
   - Používa `fixed top-0 left-0 w-full h-full`
   - **POTENCIÁLNY PROBLÉM**: Môže byť ovplyvnené CSS reset alebo parent kontajnermi

3. **INFO PANEL VIDITEĽNOSŤ**:
   ```typescript
   // Riadok 128 - Info panel sa skrýva na mobile
   <div className={`${isMobile ? "hidden" : "block"} w-[10%] h-full bg-[#111] border-l border-red-900/30`}>
   ```
   - Like/Download ikony sú v info paneli
   - Na mobile sú **ÚPLNE SKRYTÉ**
   - **KRITICKÝ PROBLÉM**: Ak je detekcia mobile nesprávna, ikony sa nezobrazia

4. **MOBILE DETEKCIA**:
   ```typescript
   // Riadok 28-35
   const checkMobile = () => {
     setIsMobile(window.innerWidth < 768)
   }
   ```
   - Hranica 768px môže byť príliš nízka
   - Desktop rozlíšenia môžu byť nesprávne detekované ako mobile

### 2. NAVBAR ANALÝZA (NAVBAR.TSX)

```typescript
// Riadok 26-30
<header
  className={`bg-gradient-to-r from-stone-900 via-gray-900 to-stone-900 text-white sticky top-0 z-50 transition-transform duration-300 shadow-2xl backdrop-blur-sm border-b border-red-800/20 ${
    hideHeader ? "-translate-y-full" : "translate-y-0"
  }`}
>
```

**PROBLÉMOVÁ ANALÝZA:**
- `sticky top-0` - môže interferovať s `fixed` elementmi
- `z-50` je nižšie ako lightbox `z-[999999]`, ale stále môže byť viditeľný

### 3. CLIENTLAYOUT.TSX ANALÝZA

```typescript
// Riadok 58-66
<div className={`${inter.className} min-h-screen flex flex-col`}>
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
    <Navbar hideHeader={hideHeader} />
    <main className="flex-grow">{children}</main>
    <Footer />
    <Toaster />
  </ThemeProvider>
</div>
```

**ŠTRUKTÚRNY PROBLÉM**:
- Lightbox je renderovaný VNÚTRI `<main>` elementu
- Navbar je MIMO main elementu na rovnakej úrovni
- **KĽÚČOVÝ PROBLÉM**: Lightbox nemôže prekryť elementy mimo svojho parent kontajnera

## ROOT CAUSE ANALÝZA

### HLAVNÁ PRÍČINA: NESPRÁVNA ŠTRUKTÚRA DOM

1. **Hierarchia DOM:**
   ```
   <div> (ClientLayout)
     ├── <Navbar /> (z-50, sticky)
     ├── <main>
     │   └── <GalleryPage>
     │       └── <ModernGallery>
     │           └── <GalleryLightbox /> (z-999999, fixed)
     ├── <Footer />
     └── <Toaster />
   ```

2. **PROBLÉM**: Lightbox je vnorený hlboko v DOM hierarchii
3. **NÁSLEDOK**: Fixed positioning je relatívne k najbližšiemu positioned ancestor
4. **VÝSLEDOK**: Lightbox nemôže prekryť navbar/footer správne

### SEKUNDÁRNE PRÍČINY:

1. **Mobile Detection Bug**:
   - Chybná detekcia veľkosti obrazovky
   - Info panel (s like/download) sa skrýva nesprávne

2. **CSS Stacking Context**:
   - Navbar môže vytvárať vlastný stacking context
   - Transform animácie môžu ovplyvniť z-index

3. **Portal Absencie**:
   - Lightbox nie je renderovaný cez React Portal
   - Nemôže "uniknúť" z parent kontajnerov

## OPRAVNÉ STRATÉGIE

### STRATÉGIA 1: REACT PORTAL (ODPORÚČANÉ)

**Výhody:**
- Lightbox sa renderuje priamo do `document.body`
- Úplná kontrola nad z-index
- Nezávislé od parent kontajnerov

**Implementácia:**
```typescript
import { createPortal } from 'react-dom'

// V GalleryLightbox komponente
return createPortal(
  <div className="fixed inset-0 z-[9999] bg-black/95">
    {/* lightbox content */}
  </div>,
  document.body
)
```

### STRATÉGIA 2: NAVBAR HIDING VIA CONTEXT

**Výhody:**
- Jednoduchá implementácia
- Rýchle riešenie

**Implementácia:**
```typescript
// Vytvoríť LightboxContext
const LightboxContext = createContext({
  isLightboxOpen: false,
  setLightboxOpen: (open: boolean) => {}
})

// V ClientLayout komponente skryť navbar keď je lightbox otvorený
```

### STRATÉGIA 3: CSS FIXES

**Výhody:**
- Minimálne zmeny kódu
- Zachováva existujúcu štruktúru

**Implementácia:**
```css
/* Pridať do globals.css */
.lightbox-open {
  overflow: hidden;
}

.lightbox-open .navbar {
  display: none !important;
}

.lightbox-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999999 !important;
}
```

## KONKRÉTNE OPRAVY POTREBNÉ

### 1. OKAMŽITÉ OPRAVY

**A) Oprava Mobile Detection:**
```typescript
// Zmeniť threshold z 768px na 1024px
const checkMobile = () => {
  setIsMobile(window.innerWidth < 1024)
}
```

**B) Forced Visibility Info Panel:**
```typescript
// Dočasné riešenie - vždy zobrazovať info panel
<div className="w-[10%] h-full bg-[#111] border-l border-red-900/30">
```

**C) Navbar Force Hide:**
```typescript
// V useEffect lightbox komponenty
useEffect(() => {
  if (currentImageId !== null) {
    // Lightbox otvorený
    const navbar = document.querySelector('header')
    if (navbar) {
      navbar.style.display = 'none'
    }
  }
  
  return () => {
    // Cleanup pri zatvorení
    const navbar = document.querySelector('header')
    if (navbar) {
      navbar.style.display = 'block'
    }
  }
}, [currentImageId])
```

### 2. DLHODOBÉ RIEŠENIE

**Implementovať React Portal:**
1. Refaktor GalleryLightbox na používanie Portal
2. Renderovať priamo do document.body
3. Kompletná nezávislosť od parent kontajnerov

## TESTOVACIA STRATÉGIA

### LOKÁLNE TESTOVANIE (POVINNÉ):

1. **Desktop Test (1920x1080):**
   - Otvorenie lightboxu
   - Viditeľnosť navbar (má byť skrytý)
   - Viditeľnosť like/download ikon
   - Navigation arrows funkčnosť

2. **Tablet Test (768x1024):**
   - Info panel viditeľnosť
   - Touch navigation
   - Escape key handling

3. **Mobile Test (375x667):**
   - Fullscreen coverage
   - Touch gestures
   - Info panel correct hiding

### DEPLOYMENT TEST:

1. Build test: `npm run build`
2. Production test na localhost:3000
3. Git commit s deskriptívnym message
4. Push na production
5. Live test na produkčnom URL

## ZÁVER

**KRITICKÉ PROBLÉMY:**
1. DOM hierarchia bráni správnemu overlay
2. Mobile detection bug skrýva dôležité UI elementy  
3. Navbar stacking context interferuje s lightbox

**PRIORITA OPRÁV:**
1. **VYSOKÁ**: Oprava mobile detection (like/download ikony)
2. **VYSOKÁ**: Implementácia proper navbar hiding
3. **STREDNÁ**: React Portal implementácia (dlhodobé riešenie)

**ODHADOVANÝ ČAS OPRAVY:**
- Okamžité fixes: 30 minút
- Portal implementation: 2 hodiny
- Kompletné testovanie: 1 hodina

**NEXT STEPS:**
1. Aplikovať okamžité opravy
2. Lokálne testovanie
3. Git commit + push
4. Implementácia Portal riešenia pre budúcnosť