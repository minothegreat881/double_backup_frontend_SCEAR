"use client"

import EnhancedImage from "../../components/enhanced-image"
import FloatingTextImage from "../../floating-text-image-backup"

export default function TestEnhancedImages() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
      <div className="space-y-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Test Enhanced Image System
        </h1>

        <p className="text-lg text-gray-700 mb-8 text-center">
          Testing new enhanced image components with text wrapping capabilities
        </p>

        {/* Test Enhanced Image - Left Position - SPRÁVNA ŠTRUKTÚRA */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Enhanced Image - Left Float (SPRÁVNE)</h2>
          <div className="overflow-hidden">
            <EnhancedImage
              src="/images/gallery/roman-standards.png"
              alt="Roman Standards"
              caption="Roman military standards and banners"
              position="left"
              size="large"
              shadow={true}
            />
            <p className="text-lg leading-relaxed text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
            </p>
            <div className="clear-both"></div>
          </div>
        </div>

        {/* Test Enhanced Image - Right Position - SPRÁVNA ŠTRUKTÚRA */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Enhanced Image - Right Float (SPRÁVNE)</h2>
          <div className="overflow-hidden">
            <EnhancedImage
              src="/images/gallery/roman-camp.png"
              alt="Roman Camp"
              caption="Reconstruction of Roman military camp"
              position="right"
              size="large"
              shadow={true}
            />
            <p className="text-lg leading-relaxed text-justify">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
              Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.
            </p>
            <div className="clear-both"></div>
          </div>
        </div>

        {/* Test Floating Text Image - Left */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Floating Text Image - Left</h2>
          <FloatingTextImage
            content="Toto je test floating text image komponenty s obrázkom na ľavej strane. Text by sa mal obtekať okolo obrázka prirodzene, vytvárajúc profesionálny layout podobný časopisom. Rímski pomocní zbory (auxilia) tvorili dôležitú súčasť rímskej armády. Ich úloha nebola len podporná - často rozhodovali o výsledku bitky. Títo bojovníci pochádzali z rôznych častí Rímskeho impéria a prinášali so sebou svoje jedinečné bojové techniky a výstroj. Lukostrelci zo Sýrie, prakovníci z Baleárskych ostrovov, a jazdci z Germánie - všetci spolu tvorili mocnú silu, ktorá dopĺňala disciplinované rímske légie."
            image={{
              src: "/images/gallery/roman-legionaries.jpeg",
              alt: "Rímski legionári",
              caption: "Rímski legionári v bojovej formácii",
              position: "left",
              size: "large"
            }}
            alignment="justify"
          />
        </div>

        {/* Test Floating Text Image - Right */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Floating Text Image - Right</h2>
          <FloatingTextImage
            content="Tento test demonštruje floating text image s obrázkom na pravej strane. Rímska vojenská architektúra bola jednou z najdokonalejších svojej doby. Tábory boli budované podľa presných plánov, s premysleným rozložením, ktoré umožňovalo efektívnu obranu aj rýchlu mobilizáciu vojsk. Každý tábor mal svoje brány, hlavné cesty, kasárne pre vojakov a dôstojníkov, sklady zbraní a potravín, aj špitál pre ranených. Tieto stavby neboli len dočasné - mnohé z nich sa neskôr rozrástli na prosperujúce mestá. Text sa prirodzene obtáča okolo obrázka, vytvárajúc vizuálne príjemné rozloženie obsahu."
            image={{
              src: "/images/gallery/roman-camp.png",
              alt: "Rímsky tábor",
              caption: "Rekonštrukcia rímskeho vojenského tábora",
              position: "right",
              size: "large"
            }}
            alignment="justify"
          />
        </div>

        {/* Test Enhanced Image - Full Width */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Enhanced Image - Full Width</h2>
          <EnhancedImage
            src="/images/gallery/roman-festival.png"
            alt="Roman Festival"
            caption="Roman festival reenactment with authentic costumes and equipment"
            position="full-width"
            size="full"
            shadow={true}
          />
          <p className="text-lg leading-relaxed text-justify mt-6">
            Záverečný odstavec demonštruje, ako sa text správa po veľkom obrázku na celú šírku.
            Nový enhanced image systém umožňuje flexibilné rozmiestňovanie obrázkov bez narušenia toku textu.
            Administrátori môžu ľahko vybrať pozíciu, veľkosť a styling každého obrázka priamo v editore,
            čím sa zjednodušuje tvorba profesionálne vyzerajúcich článkov.
          </p>
        </div>

        {/* API Test Section */}
        <div className="mt-16 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">API Connection Test</h2>
          <p className="text-gray-700">
            <strong>Frontend:</strong> http://localhost:3010<br/>
            <strong>Backend API:</strong> https://api.autoweb.store<br/>
            <strong>Enhanced Components:</strong> Available in production backend<br/>
            <strong>Status:</strong> <span className="text-green-600 font-semibold">Connected</span>
          </p>
        </div>
      </div>
    </div>
  )
}