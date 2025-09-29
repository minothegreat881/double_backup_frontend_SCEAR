# 🛡️ SCEAR Hero Images - Cloudinary Backup Guide

## ⚠️ DÔLEŽITÉ: Zálohovanie Hero Obrázkov

Aby sa hero obrázky nikdy nestratili z produkcie, musia byť nahrané na Cloudinary.

## 📋 Kroky na manuálne nahratie:

### 1. Prihlás sa do Cloudinary
- URL: https://console.cloudinary.com/console/c-9a91c33b8633fe731156752e7e93d0
- Choď do **Media Library**

### 2. Vytvor priečinok "scear-hero"
- Klikni na **Create Folder**
- Názov: `scear-hero`

### 3. Nahraj tieto súbory z lokálneho priečinka

**Lokálna cesta:** `C:\Users\milan\Desktop\Git-Projects\PROJEKT_FINALNA_VERZIA\frontend\public\images\gallery\`

| Súbor | Použitie | Status |
|-------|----------|--------|
| `roman-battle-formation.png` | História stránka | ⚠️ NAHRAJ |
| `roman-festival.png` | Podujatia stránka | ⚠️ NAHRAJ |
| `roman-camp.png` | Služby stránka | ⚠️ NAHRAJ |
| `roman-formation.png` | História články | ⚠️ NAHRAJ |

### 4. Postup nahrávania v Cloudinary:

1. Klikni na **Upload** button
2. Vyber súbory zo zložky `public\images\gallery\`
3. V nastaveniach uploadu:
   - **Folder:** `scear-hero`
   - **Public ID:** použij názov súboru bez prípony (napr. `roman-battle-formation`)
   - Klikni **Upload**

### 5. Po nahraní budú obrázky dostupné na týchto URL:

```
https://res.cloudinary.com/dii0wl9ke/image/upload/scear-hero/roman-battle-formation.png
https://res.cloudinary.com/dii0wl9ke/image/upload/scear-hero/roman-festival.png
https://res.cloudinary.com/dii0wl9ke/image/upload/scear-hero/roman-camp.png
https://res.cloudinary.com/dii0wl9ke/image/upload/scear-hero/roman-formation.png
```

## ✅ Už zálohované obrázky:

Tieto obrázky sú už bezpečne uložené v cloude:

1. **Domovská stránka:**
   - https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png

2. **Pridajte sa k nám:**
   - https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp

## 🔧 Alternatíva: Vytvorenie Upload Preset

Ak chceš automatizovať upload v budúcnosti:

1. V Cloudinary choď do **Settings** → **Upload**
2. Klikni **Add upload preset**
3. Nastav:
   - **Preset name:** `scear-upload`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `scear-hero`
4. Ulož preset

## 📝 Poznámky:

- Všetky hero obrázky by mali byť minimálne 1920x1080px
- Formáty: PNG alebo WebP pre najlepšiu kvalitu
- Po nahraní sa obrázky automaticky optimalizujú pre rýchle načítanie
- Cloudinary automaticky poskytuje CDN pre rýchle doručovanie

## 🚨 Prečo je to dôležité:

- Lokálne súbory sa môžu stratiť pri deploymente
- Cloudinary poskytuje trvalé úložisko s CDN
- Automatická optimalizácia obrázkov
- Záloha pre produkčné prostredie