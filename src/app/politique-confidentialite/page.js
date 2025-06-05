import Link from 'next/link';

export const metadata = {
  title: 'Politique de Confidentialité | Taxi VLB Verrières-le-Buisson',
  description: 'Politique de confidentialité et protection des données personnelles de Taxi VLB à Verrières-le-Buisson. Conformité RGPD.',
  robots: 'index, follow',
  openGraph: {
    title: 'Politique de Confidentialité | Taxi VLB',
    description: 'Politique de confidentialité et protection des données personnelles de Taxi VLB.',
    url: 'https://www.taxi-verrieres-le-buisson.com/politique-confidentialite',
    type: 'website',
  },
};

export default function PolitiqueConfidentialite() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Politique de Confidentialité',
            description: 'Politique de confidentialité et protection des données personnelles',
            url: 'https://www.taxi-verrieres-le-buisson.com/politique-confidentialite',
            mainEntity: {
              '@type': 'PrivacyPolicy',
              name: 'Politique de Confidentialité Taxi VLB',
              dateModified: '2025-06-05',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-gray-600">
              Dernière mise à jour : 5 juin 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                La présente politique de confidentialité décrit la façon dont Taxi VLB 
                collecte, utilise et protège vos informations personnelles lorsque vous 
                utilisez notre site web www.taxi-verrieres-le-buisson.com et nos services 
                de transport.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Nous nous engageons à protéger votre vie privée et à traiter vos données 
                personnelles de manière transparente, conformément au Règlement Général 
                sur la Protection des Données (RGPD).
              </p>
            </section>

            {/* Responsable de traitement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Responsable de traitement
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Taxi VLB</strong></p>
                <p className="text-gray-700">Adresse : Verrières-le-Buisson, 91370</p>
                <p className="text-gray-700">Téléphone : 06 XX XX XX XX</p>
                <p className="text-gray-700">Email : contact@taxi-verrieres-le-buisson.com</p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Données personnelles collectées
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                3.1 Données collectées directement
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Nom et prénom</li>
                <li>Numéro de téléphone</li>
                <li>Adresse email</li>
                <li>Adresses de prise en charge et de destination</li>
                <li>Informations de réservation (date, heure, nombre de passagers)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">
                3.2 Données collectées automatiquement
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Pages visitées et temps passé sur le site</li>
                <li>Données de géolocalisation (avec votre consentement)</li>
                <li>Cookies et technologies similaires</li>
              </ul>
            </section>

            {/* Finalités du traitement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Finalités du traitement
              </h2>
              <p className="text-gray-700 mb-4">Nous utilisons vos données personnelles pour :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Traiter vos réservations de taxi</li>
                <li>Assurer la prestation de transport</li>
                <li>Vous contacter concernant votre réservation</li>
                <li>Améliorer nos services</li>
                <li>Respecter nos obligations légales</li>
                <li>Gérer les réclamations et le service client</li>
                <li>Analyser l'utilisation de notre site web</li>
              </ul>
            </section>

            {/* Base légale */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Base légale du traitement
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Exécution du contrat</h3>
                  <p className="text-gray-700">Pour la prestation de nos services de transport.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Intérêt légitime</h3>
                  <p className="text-gray-700">Pour l'amélioration de nos services et la sécurité.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Consentement</h3>
                  <p className="text-gray-700">Pour la géolocalisation et les communications marketing.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Obligation légale</h3>
                  <p className="text-gray-700">Pour respecter les obligations réglementaires du transport.</p>
                </div>
              </div>
            </section>

            {/* Partage des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Partage des données
              </h2>
              <p className="text-gray-700 mb-4">
                Nous ne vendons, ne louons, ni ne partageons vos données personnelles 
                avec des tiers, sauf dans les cas suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Prestataires de services techniques (hébergement, maintenance)</li>
                <li>Autorités compétentes en cas d'obligation légale</li>
                <li>Partenaires de paiement sécurisé</li>
                <li>Services d'urgence si nécessaire pour votre sécurité</li>
              </ul>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Durée de conservation
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Données de réservation :</strong> 3 ans après la prestation</li>
                <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                <li><strong>Consentement cookies :</strong> 13 mois</li>
              </ul>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Vos droits
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> supprimer vos données</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
                <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, contactez-nous à : 
                <a href="mailto:contact@taxi-verrieres-le-buisson.com" className="text-blue-600 hover:underline">
                  contact@taxi-verrieres-le-buisson.com
                </a>
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Cookies et technologies similaires
              </h2>
              <p className="text-gray-700 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience de navigation :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies d'analyse :</strong> pour comprendre l'utilisation du site</li>
                <li><strong>Cookies de préférences :</strong> pour mémoriser vos choix</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Sécurité des données
              </h2>
              <p className="text-gray-700">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles contre la perte, l'utilisation abusive, 
                l'accès non autorisé, la divulgation, la modification ou la destruction.
              </p>
            </section>

            {/* Réclamations */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Réclamations
              </h2>
              <p className="text-gray-700">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire 
                une réclamation auprès de la Commission Nationale de l'Informatique et des 
                Libertés (CNIL) : 
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.cnil.fr
                </a>
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Modifications de cette politique
              </h2>
              <p className="text-gray-700">
                Nous nous réservons le droit de modifier cette politique de confidentialité 
                à tout moment. Les modifications seront publiées sur cette page avec une 
                nouvelle date de mise à jour.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou 
                l'exercice de vos droits :
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email :</strong> 
                  <a href="mailto:contact@taxi-verrieres-le-buisson.com" className="text-blue-600 hover:underline ml-2">
                    contact@taxi-verrieres-le-buisson.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Téléphone :</strong> 06 XX XX XX XX
                </p>
                <p className="text-gray-700">
                  <strong>Adresse :</strong> Verrières-le-Buisson, 91370
                </p>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}