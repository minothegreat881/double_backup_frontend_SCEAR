"use client"

import ContentBlock from "./content-block"
import EnhancedImage from "./enhanced-image"
import TextWithImage from "./text-with-image"
import FloatingTextImage from "../floating-text-image-backup"
import Image from "next/image"

export default function TestArticleDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="space-y-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Test článku s pokročilým systémom obrázkov
        </h2>

        {/* Intro paragraph */}
        <p className="text-lg leading-relaxed text-justify text-stone-800 mb-6">
          Toto je úvodný odstavec, ktorý demonštruje pokročilú funkcionalnost nášho nového systému na prácu s obrázkami.
          Nasledujúce odstavce ukážu, ako funguje obtekanie textu okolo obrázkov umiestnených na ľavej a pravej strane.
        </p>

        {/* Text with floating left image */}
        <FloatingTextImage
          content="V tomto odstavci môžete vidieť, ako obrázok umiestnený vľavo umožňuje textu obtekať ho z pravej strany. Rímski pomocní zbory (auxilia) tvorili dôležitú súčasť rímskej armády. Ich úloha nebola len podporná - často rozhodovali o výsledku bitky. Títo bojovníci pochádzali z rôznych častí Rímskeho impéria a prinášali so sebou svoje jedinečné bojové techniky a výstroj. Lukostrelci zo Sýrie, prakovníci z Baleárskych ostrovov, a jazdci z Germánie - všetci spolu tvorili mocnú silu, ktorá dopĺňala disciplinované rímske légie. Text pokračuje a obtéka obrázok prirodzene, čo vytvára profesionálny a čitateľný layout, aký nájdete v moderných magazínoch a knihách. Každý riadok textu sa prirodzene prilagodzuje priestoru okolo obrázka, čím sa vytvorí plynulý a vizuálne príjemný tok čítania. Toto je skutočný text wrapping efekt, kde sa žiadny priestor neplytvá a obsah je maximálne využitý."
          image={{
            src: "/images/gallery/roman-standards.png",
            alt: "Rímske štandardy",
            caption: "Rímske štandardy a bojové znamenia",
            position: "left",
            size: "large"
          }}
          alignment="justify"
        />

        {/* Text with floating right image */}
        <FloatingTextImage
          content="Tento odstavec demonštruje obrázok na pravej strane. Rímska vojenská architektúra bola jednou z najdokonalejších svojej doby. Tábory boli budované podľa presných plánov, s premysleným rozložením, ktoré umožňovalo efektívnu obranu aj rýchlu mobilizáciu vojsk. Každý tábor mal svoje brány, hlavné cesty, kasárne pre vojakov a dôstojníkov, sklady zbraní a potravín, aj špitál pre ranených. Tieto stavby neboli len dočasné - mnohé z nich sa neskôr rozrástli na prosperujúce mestá. Text sa prirodzene obtáča okolo obrázka na pravej strane, čím sa vytvorí vizuálne príjemné rozloženie obsahu na stránke. Floating layout umožňuje, aby sa text skutočne obtáčal okolo obrázka na všetkých úrovniach, od vrchu až po spodok obrázka. Toto vytvára prirodzený a plynulý vzhľad, ktorý je charakteristický pre profesionálne publikácie a magazíny."
          image={{
            src: "/images/gallery/roman-camp.png",
            alt: "Rímsky tábor",
            caption: "Rekonštrukcia rímskeho vojenského tábora",
            position: "right",
            size: "large"
          }}
          alignment="justify"
        />

        {/* Transition paragraph */}
        <p className="text-lg leading-relaxed text-justify text-stone-800">
          Nasledujúci obrázok je umiestnený na celú šírku článku a poskytuje dramatický vizuálny akcent.
        </p>

        {/* Full width image */}
        <div className="my-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/gallery/roman-legionaries.jpeg"
              alt="Rímski legionári"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
              <h4 className="text-white text-lg font-bold">Rímski legionári v bojovej formácii</h4>
            </div>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="bg-stone-100 p-6 rounded-lg border-l-4 border-red-800 my-8 italic text-stone-700 text-center text-xl">
          "Disciplína je duša armády; dodáva silu slabému, počet malým, úctu všetkým." - Vegétius
        </blockquote>

        {/* Final paragraph */}
        <p className="text-lg leading-relaxed text-justify text-stone-800">
          Záverečný odstavec demonštruje, ako sa text správa po veľkom obrázku na celú šírku. Nový systém umožňuje flexibilné
          rozmiestňovanie obrázkov bez narušenia toku textu. Administrátori môžu ľahko vybrať pozíciu, veľkosť a styling
          každého obrázka priamo v editore, čím sa zjednodušuje tvorba profesionálne vyzerajúcich článkov. Systém automaticky
          zabezpečuje správne clearfix a responsive správanie na všetkých zariadeniach.
        </p>
      </div>
    </div>
  )
}