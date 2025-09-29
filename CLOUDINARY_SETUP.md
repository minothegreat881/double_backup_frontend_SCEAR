# 🚨 CLOUDINARY UPLOAD PRESET SETUP

## Vytvorenie Upload Preset pre SCEAR

### 1. Prihláste sa do Cloudinary konzoly
https://console.cloudinary.com/console/c-9a91c33b8633fe731156752e7e93d0

### 2. Choďte do Settings → Upload
- V ľavom menu kliknite na **Settings**
- Vyberte záložku **Upload**

### 3. Vytvorte nový Upload Preset
- Kliknite na **Add upload preset**
- Nastavte tieto hodnoty:

#### Upload preset name:
```
scear-upload
```

#### Signing Mode:
```
Unsigned
```

#### Folder:
```
scear-hero
```

#### Allowed formats:
```
jpg, png, webp, jpeg
```

### 4. Dodatočné nastavenia (voliteľné)
- **Eager transformations**: Môžete pridať automatické transformácie
- **Tags**: Pridajte tag `scear,hero`
- **Context**: Môžete pridať metadata

### 5. Uložte preset
- Kliknite **Save** na konci stránky

## 📝 DÔLEŽITÉ
Po vytvorení upload presetu "scear-upload" bude Cloudinary widget fungovať správne a budete môcť nahrávať obrázky priamo z admin panelu.

## 🔄 Alternatíva: Použitie existujúceho presetu
Ak už máte vytvorený unsigned preset, môžete ho použiť zmenou hodnoty v súbore:
`components/admin/cloudinary-upload-widget.tsx`

Zmeňte riadok:
```javascript
uploadPreset: "scear-upload"
```
na váš existujúci preset.

## 📌 Aktuálne používané URLs
Momentálne používame Vercel Storage URLs, ktoré fungujú:
- Home: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png
- History: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roman-battle-uGqgXiNZxmKYqeGOeV9jBG36AKDaXZ.jpg
- Events: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colosseum-rome-JOvKJA3xJRD6qoLF4WEP4mq8TgQu3Z.jpeg
- Gallery: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roman-standards-AKbDxqGOeV9jBG36AKDaXZ.jpg
- Services: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1200_Roman%20Honor%20Guard_simple_compose_01jvc8h7fef1wahr6t5q1sndqn-X8GapSfxFlYSooMsY4HM66YSuTONot.png
- Join Us: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp

Po vytvorení upload presetu môžete nahrať nové obrázky na Cloudinary a tie sa budú používať namiesto Vercel Storage.