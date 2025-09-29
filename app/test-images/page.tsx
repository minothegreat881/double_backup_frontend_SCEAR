import TestArticleDemo from "@/components/test-article-demo"
import "@/styles/text-wrapping.css"

export const metadata = {
  title: "Test - Pokročilý systém obrázkov | S.C.E.A.R.",
  description: "Demonštrácia nového systému na pokročilé rozmiestňovanie obrázkov s text wrappingom",
}

export default function TestImagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test pokročilého systému obrázkov
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Táto stránka demonštruje nové funkcie pre pokročilé rozmiestňovanie obrázkov
            s text wrappingom a flexibilnými pozičnými možnosťami.
          </p>
        </div>

        <TestArticleDemo />

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Funkcie systému:</h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li>• <strong>Text wrapping:</strong> Obrázky vľavo/vpravo umožňujú textu obtekanie</li>
              <li>• <strong>Flexibilné pozície:</strong> left, right, center, full-width</li>
              <li>• <strong>Responsive design:</strong> Automatické prispôsobenie na mobilných zariadeniach</li>
              <li>• <strong>Visual styling:</strong> Configurable border radius, shadows, spacing</li>
              <li>• <strong>Content blocks:</strong> Modulárny systém pre mixing textu a obrázkov</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}