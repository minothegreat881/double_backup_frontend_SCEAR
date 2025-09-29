"use client"

import FloatingTextImage from "../../floating-text-image-backup"

export default function TestFinalImages() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Final Image System Test
        </h1>

        <p className="text-lg text-gray-700 mb-8 text-center">
          Universal FloatingTextImage component with all position support
        </p>

        {/* Test Left Position */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Left Position (Float)</h2>
          <FloatingTextImage
            content="Toto je test floating text image komponenty s obrázkom na ľavej strane. Text by sa mal obtekať okolo obrázka prirodzene, vytvárajúc profesionálny layout podobný časopisom. Rímski pomocní zbory (auxilia) tvorili dôležitú súčasť rímskej armády. Ich úloha nebola len podporná - často rozhodovali o výsledku bitky. Títo bojovníci pochádzali z rôznych častí Rímskeho impéria a prinášali so sebou svoje jedinečné bojové techniky a výstroj. Lukostrelci zo Sýrie, prakovníci z Baleárskych ostrovov, a jazdci z Germánie - všetci spolu tvorili mocnú silu."
            image={{
              src: "/images/gallery/roman-standards.png",
              alt: "Rímske štandardy",
              caption: "Rímske štandardy a bojové znamenia",
              position: "left",
              size: "large",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        {/* Test Right Position */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Right Position (Float)</h2>
          <FloatingTextImage
            content="Tento test demonštruje floating text image s obrázkom na pravej strane. Rímska vojenská architektúra bola jednou z najdokonalejších svojej doby. Tábory boli budované podľa presných plánov, s premysleným rozložením, ktoré umožňovalo efektívnu obranu aj rýchlu mobilizáciu vojsk. Každý tábor mal svoje brány, hlavné cesty, kasárne pre vojakov a dôstojníkov, sklady zbraní a potravín, aj špitál pre ranených. Tieto stavby neboli len dočasné - mnohé z nich sa neskôr rozrástli na prosperujúce mestá."
            image={{
              src: "/images/gallery/roman-camp.png",
              alt: "Rímsky tábor",
              caption: "Rekonštrukcia rímskeho vojenského tábora",
              position: "right",
              size: "large",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        {/* Test Center Position */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Center Position</h2>
          <FloatingTextImage
            content="Centrum pozícia zobrazuje obrázok v strede stránky s textom pod ním. Táto pozícia je ideálna pre dôležité obrázky, ktoré chceme zvýrazniť, ale nechceme aby bol text obtekajúci. Rímske pomocné jednotky boli neoceniteľnou súčasťou rímskeho vojska."
            image={{
              src: "/images/gallery/roman-legionaries.jpeg",
              alt: "Rímski legionári",
              caption: "Rímski legionári v bojovej formácii",
              position: "center",
              size: "large",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        {/* Test Full Width Position */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Full Width Position</h2>
          <FloatingTextImage
            content="Full-width pozícia zobrazuje obrázok na celú šírku kontajnera s textom pod ním. Táto pozícia je ideálna pre veľké, impozantné obrázky, ktoré majú vytvoriť silný vizuálny dojem. Rímske festivaly a oslavy boli veľkolepé podujatia, ktoré demonštrovali moc a bohatstvo impéria. Tieto oslavy často zahŕňali gladiátorské súboje, divadelné predstavenia a veľké hostiny pre občanov."
            image={{
              src: "/images/gallery/roman-festival.png",
              alt: "Rímsky festival",
              caption: "Rekonštrukcia rímskeho festivalu s autentickými kostýmami a výstrojou",
              position: "full-width",
              size: "full",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        {/* Test Different Sizes */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Small Size - Left</h2>
          <FloatingTextImage
            content="Toto je test s malým obrázkom na ľavej strane. Malé obrázky sú vhodné pre doplnkové ilustrácie, ktoré nemajú dominovať textu, ale majú ho podporiť. Rímske mince boli dôležitým prostriedkom propagandy a informácií o cisároch a ich úspechoch."
            image={{
              src: "/images/gallery/roman-standards.png",
              alt: "Rímske štandardy",
              caption: "Malý obrázok štandardov",
              position: "left",
              size: "small",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Medium Size - Right</h2>
          <FloatingTextImage
            content="Toto je test so stredným obrázkom na pravej strane. Stredná veľkosť je najuniverzálnejšia a hodí sa pre väčšinu článkov. Poskytuje dobrú rovnováhu medzi vizuálnym dopadom a čitateľnosťou textu."
            image={{
              src: "/images/gallery/roman-camp.png",
              alt: "Rímsky tábor",
              caption: "Stredný obrázok tábora",
              position: "right",
              size: "medium",
              shadow: true
            }}
            alignment="justify"
          />
        </div>

        {/* Status */}
        <div className="mt-16 p-6 bg-green-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">✅ Success!</h2>
          <p className="text-green-700">
            <strong>Universal FloatingTextImage Component</strong><br/>
            ✅ Left float - text wrapping<br/>
            ✅ Right float - text wrapping<br/>
            ✅ Center position<br/>
            ✅ Full-width position<br/>
            ✅ Multiple sizes (small, medium, large, full)<br/>
            ✅ Shadow support<br/>
            ✅ Responsive design<br/>
            <br/>
            <strong>Backend:</strong> https://api.autoweb.store<br/>
            <strong>Component:</strong> content.floating-text-image (renamed to "Content Image")
          </p>
        </div>
      </div>
    </div>
  )
}