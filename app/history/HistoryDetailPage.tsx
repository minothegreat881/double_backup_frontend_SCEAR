"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { type HistoryArticle } from "@/lib/history-articles-api"
import { getStrapiImageUrl } from "@/lib/strapi-utils"
import ArticleContent from "@/components/history/ArticleContent"

// Define the content for each history topic
const historyContent = {
  "auxiliary-forces": {
    title: "Rímska armáda a pomocné zbory",
    description: "Komplexný pohľad na štruktúru a význam pomocných zborov v rímskej armáde",
    heroImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-feature-nALxPqAUP6KnV6wpViBvho4fjZJ3J6.png",
    mainImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png",
    date: "May 20, 2025",
    category: "Historical Research",
    author: "S.C.E.A.R.",
    content: {
      intro: `Rímska armáda tvorila rôznorodý celok, ktorý sa v období antiky zdokonalil na takú vysokú úroveň, že nenachádzal v oblasti Európy, prednej Ázie a Afriky po dobu celých tristo rokov obdobu. Okrem najznámejších základných zložiek, légií, ktoré tvorili najväčšiu údernú silu rímskej armády, existovali aj iné zložky, ktorých príslušnosť k rímskej armáde je menej známa medzi verejnosťou, no bez nich by rímska armáda určite nenadobudla tak vysokú úroveň a také úspechy vo vojenských ťaženiach, ako práve v období vlády G. I. Caesara až po obdobie vlády Marca Aurelia. Boli to práve flotila (classis), artiléria, pomocné zbory (auxilia), inžinieri, technici, vozataji a honci, ktorí dopĺňali každodenné fungovanie armády, či už priamo v boji, alebo pri jej presunoch a zásobovaní.`,
      sections: [
        {
          title: "Pomocné zbory v rímskej armáde",
          content: `Rímske pomocné zbory, auxilie, tvorili podporné jednotky rímskej armády. Už od čias konzulátu Gaia Maria v závere 2. storočia pr. Kr. a jeho vojenskej reformy boli najímaní mimoitalskí spojenci, odvedenci z provincií a cudzinci ako žoldnieri do rímskej armády. Podľa potreby, alebo podľa zručnosti so zbraňou, ktorá bola pre daný národ a región najtypickejšia, boli títo nerímski žoldnieri priraďovaný k pechote (peditates), alebo k jazdectvu (equitates).`,
          quote: `"K peditates patrili sagittarii (lukostrelci), funditores (prakovníci) a vrhači oštepov, ktorí zároveň bojovali aj ako kopijníci. Tí tvorili jednotky, ktoré sa nazývali kohorty. K equitates prislúchali vojaci na koni vybavení kopijou a menším oválnym, alebo šesťhranným štítom (ala), a jazdci vybavení lukom (ala sagittariorum). Tí tvorili tzv. aly (alae)."`,
          additionalContent: [
            `V čase vlády cisára Octaviana Augusta tvorilo tieto jednotky 130 000 mužov a do 2. storočia po Kr. vzrástol ich počet až na 225 000.`,
            `Veliteľmi týchto jednotiek boli rímski občania, ktorí mali hodnosť veliteľa tábora (praefectus castrorum) a veliteľa kohorty (praefectus cohortis), ojedinelejšie sú prípady, kedy im velili samotní barbarskí velitelia. Pechota bola rozčlenená na centúrie, čiže nižšími dôstojníkmi centúrií boli centurioni. Jazdeckej jednotke velil okrem veliteľa tábora veliteľ aly (praefectus alae). Nižšími veliteľmi boli kapitáni jazdectva (decuriones), ktorí velili menším útvarom v rámci aly, turmám (turmae).`,
          ],
        },
        {
          title: "Služba a odmeny",
          content: `Služba rímskych auxilii v rímskej armáde bola záväzkom na 25 rokov. Keďže neboli rímskymi občanmi, nemohli využívať napr. volebné právo a tiež nemohli zastávať žiaden úrad v provincii. Žold, nadobudnutie občianstva a dedičné právo na občianstvo pre celú rodinu bolo pomerne veľkým lákadlom pre nerímskych obyvateľov provincií (peregrinas). Ich ročný žold bol na rozdiel od legionárov o tretinu nižší a vojenská služba o 5 rokov dlhšia.`,
          additionalContent: [
            `Po skončení služby bol udelený vojakom auxilii bronzový diplom, ktorý obsahoval ich meno, meno cisára, za ktorého vlády svoju službu ukončili, pričom k ich menu pribudlo i stredné meno cisára, ktorý im diplom vydal, zvyšok žoldu, ktorý im armáda šetrila na koniec služby a opis čestného prepustenia z príslušného cisárskeho dekrétu. V prípade, že mali manželku, nadobudlo toto manželstvo riadnu platnosť. Vojak veterán a jeho rodina získali dedičné občianstvo, ktoré mohli v plnom rozsahu využívať.`,
          ],
        },
      ],
      images: [
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-1-7vZnkwPzciqlEtMHNHSW2Rz8SZ94EU.png",
          alt: "Rímski prakovníci v boji",
          caption: "Rímski prakovníci v boji",
        },
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-2-QLs0CqDTa00dTPhLSDWRjpozWVNsJC.png",
          alt: "Rímska jazda v útoku",
          caption: "Rímska jazda v útoku",
        },
        {
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-feature-nALxPqAUP6KnV6wpViBvho4fjZJ3J6.png",
          alt: "Rímski auxiliári v bojovej formácii",
          caption: "Rímski auxiliári v bojovej formácii",
          description: "Auxiliárne jednotky boli známe svojou disciplínou a efektivitou v boji",
        },
      ],
      keyFacts: [
        {
          number: 1,
          title: "Počet vojakov",
          description: "Za Augusta 130 000, v 2. storočí až 225 000 mužov",
        },
        {
          number: 2,
          title: "Dĺžka služby",
          description: "25 rokov (o 5 rokov dlhšia než u legionárov)",
        },
        {
          number: 3,
          title: "Žold",
          description: "O tretinu nižší než u legionárov",
        },
        {
          number: 4,
          title: "Odmena",
          description: "Rímske občianstvo po ukončení služby",
        },
      ],
      unitTypes: [
        {
          title: "Peditates (pechota)",
          units: ["Sagittarii (lukostrelci)", "Funditores (prakovníci)", "Kopijníci a oštepári"],
        },
        {
          title: "Equitates (jazdectvo)",
          units: ["Ala (jazdci s kopijami)", "Ala sagittariorum (jazdní lukostrelci)"],
        },
      ],
    },
  },
  "xv-legia-apollinaris": {
    title: "XV. légia Apollinaris",
    description: "História XV. légie Apollinaris a jej pôsobenie v Rímskej ríši",
    heroImage: "/images/gallery/roman-formation.png",
    mainImage: "/images/gallery/roman-battle-formation.png",
    date: "May 25, 2025",
    category: "Legion History",
    author: "S.C.E.A.R.",
    content: {
      intro: `Rímske impérium zaujalo po niekoľkých povstaniach a vojnách v oblasti Pannonie a Illyrica strategické pozície, ktoré upevnili na území stredného Dunaja vojenskými tábormi légií. Za vlády cisára Claudia (41 – 54 po Kr.) vzniká na území dnešného mestečka Bad Deutsch – Altenburg (Dolné Rakúsko) drevo – zemný tábor. XV. légia appolinaris tu niekoľko rokov aktívne pôsobila.`,
      sections: [
        {
          title: "Počiatky XV. légie",
          content: `Už od Galských vojen, v ktorých rímske vojská viedol Gaius Julius Caesar, začala písať XV. légia svoje dejiny. Začalo to rokom 53 pr. Kr. Odvtedy légia vystriedala množstvo miest, v ktorých bola umiestnená. Po Galských vojnách viedli jej cesty z Aquileie do Capui, kde sa pridala na stranu Pompeia v občianskej vojne proti Caesarovi, po prehratej bitke pri Pharsale (dnešná Thesália) sa jej ujal Caesar, ktorý ju doplnil o nových regrutovaných vojakov.`,
          additionalContent: [
            `Légia sa zúčastnila pravdepodobne aj bitky o Philippi medzi Octavianom a Antoniom po Caesarovej vražde roku 44 pr. Kr. Kedy získala légia svoj prívlastok Apollinaris nie je presne známe, no predpokladá sa, že k tomu mohlo dôjsť v roku 31 pr. Kr., kedy vojsko Octaviana Augusta zvíťazilo nad vojskami Marca Antonia v bitke pri Actiu.`,
          ],
        },
        {
          title: "Prívlastok Apollinaris",
          content: `Appolinaris je odvodené od rímskeho boha Apollóna, ktorého mal Octavian veľmi v úcte ako ochrancu rodiny a ako nositeľa víťazstiev v bitkách. Najviac pravdepodobné teda je, že týmto pridelením prívlastku Apollinaris XV légii demonštroval priazeň Apollóna pred Marcom Antoniom, ktorý sa vyhlasoval za boha Dionýza, a ktorý bitku pri Actiu prehral.`,
          quote: `"Appolinaris je odvodené od rímskeho boha Apollóna, ktorého mal Octavian veľmi v úcte ako ochrancu rodiny a ako nositeľa víťazstiev v bitkách."`,
        },
        {
          title: "Vojenské ťaženia",
          content: `V rokoch 27 – 19 pr. Kr. bojovala légia v Hispánii proti Cantabrijčanom, Asturičanom a Lusitancom, v roku 16 pr. Kr. vypukla panónsko-dalmatská vojna, a následne po obsadení západnej Pannonie aj povstanie v rokoch 13 – 8 pr. Kr., v ktorom bola XV légia Apollinaris s istotou zapojená. V rámci potlačenia povstania v Pannonii bola légia pod velením veliteľa Tiberia, budúceho rímskeho cisára, umiestnená v Emone (Ljubľana, Slovinsko).`,
          additionalContent: [
            `K jej umiestneniu v tábore Carnuntum na brehoch Dunaja došlo okolo rokov 40/50 po Kr., kedy sa podieľala na stavbe tábora pre účely pevného staciovania légie na strategickom mieste. Jej úlohou bolo odvtedy strážiť pohraničie pred germánskymi Markomannmi. V roku 63 po Kr. bola XV légia odvelená na východ Rímskeho impéria, aby zažehnala nebezpečenstvo na pohraničí s Parthskou ríšou. Vypuknutím Židovskej vojny v roku 66 po Kr. tvorila légia údernú silu Vespasianovho vojska.`,
          ],
        },
        {
          title: "Neskoršie obdobie",
          content: `Roku 71 po Kr. sa predpokladá jej návrat do Carnunta, kde budovala už trvácnejší kamenný tábor a pobudla tu približne do roku 107 po Kr., kedy bola cisárom Traianom preložená do Egypta. V čase jej pobytu v Carnunte zaznamenávame jej účasť aj v Dunajských vojnách za cisára Domitiana (81 – 96 po Kr.), Dáckych vojnách v roku 86 po Kr. a tiež na sarmatsko-germánskych vojnách v rokoch 89 – 92 po Kr.`,
          additionalContent: [
            `Za vlády Traiana sa vexillacia (časť légie) podieľala aj na Dáckej vojne v rokoch 101 – 106 po Kr. Od vlády cisára Hadriana (117 – 138 po Kr.) bola už XV légia Apollinaris umiestnená v meste Satala pri rieke Eufrat a do bojov v Podunajskej oblasti sa zapojila už iba ako vexillacia v 1. fáze Markomanských vojen v rokoch 169 – 174 po Kr., kedy bola aj účastníkom zvláštneho úkazu v krajine Kvádov, „Zázračného dažďa".`,
          ],
        },
      ],
      images: [
        {
          src: "/images/gallery/roman-standards.png",
          alt: "Štandarda XV. légie Apollinaris",
          caption: "Štandarda XV. légie Apollinaris",
        },
        {
          src: "/images/gallery/roman-camp.png",
          alt: "Tábor v Carnunte",
          caption: "Tábor v Carnunte",
        },
        {
          src: "/images/gallery/roman-legionaries.jpeg",
          alt: "Légia v bojovej formácii",
          caption: "Légia v bojovej formácii",
          description: "Rímske légie boli známe svojou disciplínou a efektivitou v boji",
        },
        {
          src: "/images/gallery/colosseum-rome.jpeg",
          alt: "Rímska architektúra",
          caption: "Rímska architektúra",
          description: "Rímska architektúra ako symbol moci impéria",
        },
      ],
      keyFacts: [
        {
          number: 1,
          title: "Založenie",
          description: "Okolo roku 53 pr. Kr. počas Galských vojen",
        },
        {
          number: 2,
          title: "Prívlastok",
          description: "Apollinaris - podľa boha Apollóna",
        },
        {
          number: 3,
          title: "Hlavné tábory",
          description: "Carnuntum (40-107 po Kr.), neskôr Satala",
        },
        {
          number: 4,
          title: "Významné bitky",
          description: "Bitka pri Actiu, Židovská vojna, Markomanské vojny",
        },
      ],
      timeline: [
        {
          year: "53 pr. Kr.",
          event: "Založenie légie počas Galských vojen",
        },
        {
          year: "31 pr. Kr.",
          event: "Pravdepodobné získanie prívlastku Apollinaris po bitke pri Actiu",
        },
        {
          year: "40-50 po Kr.",
          event: "Umiestnenie v tábore Carnuntum",
        },
        {
          year: "63 po Kr.",
          event: "Presun na východ Rímskeho impéria",
        },
        {
          year: "66 po Kr.",
          event: "Účasť v Židovskej vojne",
        },
        {
          year: "71 po Kr.",
          event: "Návrat do Carnunta",
        },
        {
          year: "107 po Kr.",
          event: "Presun do Egypta",
        },
        {
          year: "117-138 po Kr.",
          event: "Umiestnenie v meste Satala pri rieke Eufrat",
        },
        {
          year: "169-174 po Kr.",
          event: "Účasť v Markomanských vojnách",
        },
      ],
    },
  },
}

export default function HistoryDetailPage({ slug, article }: { slug: string; article?: HistoryArticle }) {
  // Get the content for the specified slug
  const staticContent = historyContent[slug as keyof typeof historyContent]

  // Use article from database if available, otherwise use static content
  const content = article ? {
    title: article.title,
    description: article.subtitle || article.seoDescription || '',
    heroImage: getStrapiImageUrl(article.heroImage?.url) || '/images/gallery/roman-formation.png',
    mainImage: getStrapiImageUrl(article.mainImage?.url) || getStrapiImageUrl(article.heroImage?.url) || '/images/gallery/roman-battle-formation.png',
    date: new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: article.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'History',
    author: article.author || 'S.C.E.A.R.',
    content: {
      intro: article.mainContent,  // Pass raw content, not rendered string
      sections: [],
      images: [],
      keyFacts: (() => {
        console.log('Article object for key facts extraction:', article)
        console.log('Article sidebarComponents:', article.sidebarComponents)
        return extractKeyFacts(article.sidebarComponents || [])
      })(),
      unitTypes: [],
      timeline: (() => {
        console.log('Article object for timeline extraction:', article)
        console.log('Article sidebarComponents:', article.sidebarComponents)
        return extractTimeline(article.sidebarComponents || [])
      })()
    }
  } : staticContent

  // If content doesn't exist, show a placeholder
  if (!content) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Obsah sa pripravuje</h1>
          <p className="mb-6">Tento historický článok je momentálne v príprave.</p>
          <Button asChild variant="outline">
            <Link href="/history" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Späť na históriu
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src={content.heroImage || "/images/gallery/roman-formation.png"}
          alt={content.title}
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/history" className="text-white/80 hover:text-white flex items-center">
              <ChevronLeft className="h-4 w-4" />
              Späť na históriu
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{content.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl">{content.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-12 gap-0">
            <div className="md:col-span-12 relative h-96">
              <Image
                src={content.mainImage || "/images/gallery/roman-battle-formation.png"}
                alt={content.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-sm text-white/80 mb-2">
                  {content.date} • {content.category} • Autor: {content.author}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h2>
                <p className="text-lg text-white/90 max-w-3xl">{content.description}</p>
              </div>
            </div>

            <div className="md:col-span-8 p-8">
              <div className="prose prose-stone max-w-none article-content">
                {/* Introduction - Render rich text content if from article, otherwise static content */}
                {article ? (
                  <ArticleContent
                    mainContent={article.mainContent}
                    contentImages={article.contentImages}
                  />
                ) : (
                  <p className="text-lg leading-relaxed text-justify">
                    <span className="text-3xl font-serif float-left mr-3 mt-1">{typeof content.content.intro === 'string' ? content.content.intro.charAt(0) : ''}</span>
                    {typeof content.content.intro === 'string' ? content.content.intro.substring(1) : ''}
                  </p>
                )}

                {/* Content Sections with Images */}
                {slug === "xv-legia-apollinaris" ? (
                  // Special layout for XV Legion
                  <>
                    {/* First section with side-by-side images */}
                    <h3 className="text-2xl font-bold mt-8 mb-4" id="pociatky">
                      <Link href="#pociatky" className="hover:text-red-700 transition-colors">
                        {content.content.sections[0].title}
                      </Link>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div>
                        <p className="mb-4 text-justify">{content.content.sections[0].content}</p>
                        <p className="mb-4 text-justify">{content.content.sections[0].additionalContent?.[0]}</p>
                      </div>
                      <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                        <Image
                          src="/images/gallery/roman-standards.png"
                          alt="Štandarda XV. légie Apollinaris"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
                          Štandarda XV. légie Apollinaris
                        </div>
                      </div>
                    </div>

                    {/* Second section with quote */}
                    <h3 className="text-2xl font-bold mt-8 mb-4" id="privlastok">
                      <Link href="#privlastok" className="hover:text-red-700 transition-colors">
                        {content.content.sections[1].title}
                      </Link>
                    </h3>
                    <p className="mb-4 text-justify">{content.content.sections[1].content}</p>
                    <div className="bg-stone-100 p-6 rounded-lg my-6 border-l-4 border-red-800">
                      <p className="italic text-stone-700">{content.content.sections[1].quote}</p>
                    </div>

                    {/* Full-width image */}
                    <div className="my-8">
                      <div className="relative h-96 w-full rounded-lg overflow-hidden">
                        <Image
                          src={content.content.images[2].src || "/placeholder.svg"}
                          alt={content.content.images[2].alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                          <h4 className="text-white text-lg font-bold">{content.content.images[2].caption}</h4>
                          <p className="text-white/80 text-sm">{content.content.images[2].description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Third section */}
                    <h3 className="text-2xl font-bold mt-8 mb-4" id="vojenske-tazenia">
                      <Link href="#vojenske-tazenia" className="hover:text-red-700 transition-colors">
                        {content.content.sections[2].title}
                      </Link>
                    </h3>
                    <p className="mb-4 text-justify">{content.content.sections[2].content}</p>
                    <p className="mb-4 text-justify">{content.content.sections[2].additionalContent?.[0]}</p>

                    {/* Image and text side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                      <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                        <Image
                          src={content.content.images[1].src || "/placeholder.svg"}
                          alt={content.content.images[1].alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
                          {content.content.images[1].caption}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4" id="neskorsie-obdobie">
                          <Link href="#neskorsie-obdobie" className="hover:text-red-700 transition-colors">
                            {content.content.sections[3].title}
                          </Link>
                        </h3>
                        <p className="mb-4 text-justify">{content.content.sections[3].content}</p>
                      </div>
                    </div>

                    <p className="mb-4 text-justify">{content.content.sections[3].additionalContent?.[0]}</p>

                    {/* Final image */}
                    <div className="my-8">
                      <div className="relative h-80 w-full rounded-lg overflow-hidden">
                        <Image
                          src={content.content.images[3].src || "/placeholder.svg"}
                          alt={content.content.images[3].alt}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                          <h4 className="text-white text-lg font-bold">{content.content.images[3].caption}</h4>
                          <p className="text-white/80 text-sm">{content.content.images[3].description}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Original layout for other articles
                  <>
                    <div className="my-8 grid grid-cols-2 gap-4">
                      {content.content.images.slice(0, 2).map((image, index) => (
                        <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm">
                            {image.caption}
                          </div>
                        </div>
                      ))}
                    </div>

                    {content.content.sections.map((section, index) => (
                      <div key={index}>
                        <h3
                          className="text-2xl font-bold mt-8 mb-4"
                          id={section.title.toLowerCase().replace(/\s+/g, "-")}
                        >
                          <Link
                            href={`#${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                            className="hover:text-red-700 transition-colors"
                          >
                            {section.title}
                          </Link>
                        </h3>
                        <p className="mb-4 text-justify">{section.content}</p>

                        {section.quote && (
                          <div className="bg-stone-100 p-6 rounded-lg my-6 border-l-4 border-red-800">
                            <p className="italic text-stone-700">{section.quote}</p>
                          </div>
                        )}

                        {section.additionalContent?.map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4 text-justify">
                            {paragraph}
                          </p>
                        ))}

                        {index === 0 && content.content.images[2] && (
                          <div className="my-8">
                            <div className="relative h-96 w-full rounded-lg overflow-hidden">
                              <Image
                                src={content.content.images[2].src || "/placeholder.svg"}
                                alt={content.content.images[2].alt}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                                <h4 className="text-white text-lg font-bold">{content.content.images[2].caption}</h4>
                                <p className="text-white/80 text-sm">{content.content.images[2].description}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-4 bg-stone-50 p-8">
              <div className="sticky top-24">
                {/* Show Key Facts if available */}
                {content.content.keyFacts && content.content.keyFacts.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-4 pb-2 border-b border-stone-200">Kľúčové fakty</h3>
                    <ul className="space-y-4">
                      {content.content.keyFacts.map((fact, index) => (
                        <li key={index} className="flex gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-800 flex items-center justify-center text-white font-bold text-xs">
                            {fact.number || index + 1}
                          </div>
                          <div className="text-sm">
                            <strong>{fact.title}:</strong> {fact.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Show Timeline if available */}
                {content.content.timeline && content.content.timeline.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-stone-200">Časová os</h3>
                    <div className="space-y-4">
                      {content.content.timeline.map((item, index) => (
                        <div key={index} className="relative pl-6 pb-4 border-l border-red-800">
                          <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1.5 rounded-full bg-red-800"></div>
                          <div className="font-bold text-sm">{item.year}</div>
                          <div className="text-sm text-stone-700">{item.event}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Show Unit Types only for auxiliary-forces category */}
                {slug !== "xv-legia-apollinaris" && content.content.unitTypes && content.content.unitTypes.length > 0 && (
                  // Unit types for Auxiliary Forces
                  <>
                    <h3 className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-stone-200">Typy jednotiek</h3>
                    <div className="space-y-3">
                      {content.content.unitTypes.map((type, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-stone-200">
                          <h4 className="font-bold text-sm">{type.title}</h4>
                          <ul className="text-sm mt-1 space-y-1 text-stone-700">
                            {type.units.map((unit, uIndex) => (
                              <li key={uIndex}>• {unit}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-8">
                  <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                    <Link href="/join-us">
                      Staňte sa členom S.C.E.A.R. <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Back to History Button */}
      <section className="py-8 container mx-auto px-4 text-center">
        <Button asChild variant="outline" className="mx-auto">
          <Link href="/history" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Späť na históriu
          </Link>
        </Button>
      </section>
    </div>
  )
}

// Helper function to render content from Strapi format
function renderContent(mainContent: any): string {
  if (!mainContent) return ''

  if (typeof mainContent === 'string') return mainContent

  if (Array.isArray(mainContent)) {
    return mainContent.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      if (block.type === 'heading' && block.children) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      if (block.type === 'list' && block.children) {
        return block.children.map((item: any) =>
          item.children?.map((child: any) => child.text || '').join('') || ''
        ).join('\n')
      }
      if (block.type === 'quote' && block.children) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      return ''
    }).join('\n\n')
  }

  return JSON.stringify(mainContent)
}

// Helper function to extract key facts from sidebar components
function extractKeyFacts(sidebarComponents: any[]): any[] {
  if (!sidebarComponents) {
    console.log('No sidebarComponents provided to extractKeyFacts')
    return []
  }

  console.log('Extracting key facts from:', sidebarComponents)

  // Filter ALL key-facts components, not just the first one
  const keyFactsComponents = sidebarComponents.filter(comp =>
    comp.__component === 'sidebar.key-facts'
  )

  if (!keyFactsComponents || keyFactsComponents.length === 0) {
    console.log('No key-facts components found in:', sidebarComponents.map(c => c.__component))
    return []
  }

  console.log('Found', keyFactsComponents.length, 'key-facts component(s):', keyFactsComponents)

  // Collect facts from ALL key-facts components
  const allFacts: any[] = []
  keyFactsComponents.forEach((component, index) => {
    console.log(`Component ${index + 1} structure:`, JSON.stringify(component, null, 2))

    // Try different structures - data.facts, facts, or fallback
    const facts = component?.data?.facts || component?.facts || []
    console.log(`Component ${index + 1} facts:`, facts)

    if (Array.isArray(facts)) {
      allFacts.push(...facts)
    }
  })

  console.log('Total extracted facts:', allFacts.length)
  return allFacts
}

// Helper function to extract timeline from sidebar components
function extractTimeline(sidebarComponents: any[]): any[] {
  if (!sidebarComponents) {
    console.log('No sidebarComponents provided to extractTimeline')
    return []
  }

  console.log('Extracting timeline from:', sidebarComponents)

  // Filter ALL timeline components, not just the first one
  const timelineComponents = sidebarComponents.filter(comp =>
    comp.__component === 'sidebar.timeline'
  )

  if (!timelineComponents || timelineComponents.length === 0) {
    console.log('No timeline components found in:', sidebarComponents.map(c => c.__component))
    return []
  }

  console.log('Found', timelineComponents.length, 'timeline component(s):', timelineComponents)

  // Collect events from ALL timeline components
  const allEvents: any[] = []
  timelineComponents.forEach((component, index) => {
    console.log(`Timeline component ${index + 1} structure:`, JSON.stringify(component, null, 2))

    // Try different structures - data.events, events, or fallback
    const events = component?.data?.events || component?.events || []
    console.log(`Timeline component ${index + 1} events:`, events)

    if (Array.isArray(events)) {
      allEvents.push(...events)
    }
  })

  console.log('Total extracted timeline events:', allEvents.length)
  return allEvents
}
