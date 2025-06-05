import Link from 'next/link';

export const metadata = {
  title: 'Mentions Légales | Taxi VLB Verrières-le-Buisson',
  description: 'Mentions légales du site Taxi VLB à Verrières-le-Buisson. Informations légales et conditions d\'utilisation.',
  robots: 'index, follow',
  openGraph: {
    title: 'Mentions Légales | Taxi VLB',
    description: 'Mentions légales du site Taxi VLB à Verrières-le-Buisson.',
    url: 'https://www.taxi-verrieres-le-buisson.com/mentions-legales',
    type: 'website',
  },
};

export default function MentionsLegales() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Mentions Légales',
            description: 'Mentions légales et informations juridiques',
            url: 'https://www.taxi-verrieres-le-buisson.com/mentions-legales',
            mainEntity: {
              '@type': 'LegalService',
              name: 'Mentions Légales Taxi VLB',
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
              Mentions Légales
            </h1>
            <p className="text-lg text-gray-600">
              Dernière mise à jour : 5 juin 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Éditeur du site */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Éditeur du site
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Dénomination sociale :</h3>
                  <p className="text-gray-700">Taxi VLB</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Forme juridique :</h3>
                  <p className="text-gray-700">Entreprise individuelle</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Adresse du siège social :</h3>
                  <p className="text-gray-700">Verrières-le-Buisson, 91370, France</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Téléphone :</h3>
                  <p className="text-gray-700">06 XX XX XX XX</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email :</h3>
                  <p className="text-gray-700">contact@taxi-verrieres-le-buisson.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">SIRET :</h3>
                  <p className="text-gray-700">[À compléter]</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Numéro de TVA :</h3>
                  <p className="text-gray-700">[À compléter]</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Licence de transport :</h3>
                  <p className="text-gray-700">[Numéro de licence taxi - À compléter]</p>
                </div>
              </div>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Directeur de publication
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>Nom :</strong> [Nom du propriétaire - À compléter]
                </p>
                <p className="text-gray-700">
                  <strong>Qualité :</strong> Gérant
                </p>
                <p className="text-gray-700">
                  <strong>Email :</strong> contact@taxi-verrieres-le-buisson.com
                </p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Hébergement du site
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Hébergeur :</h3>
                  <p className="text-gray-700">[Nom de l'hébergeur - À compléter]</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Adresse :</h3>
                  <p className="text-gray-700">[Adresse de l'hébergeur - À compléter]</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Téléphone :</h3>
                  <p className="text-gray-700">[Téléphone de l'hébergeur - À compléter]</p>
                </div>
              </div>
            </section>

            {/* Conditions d'utilisation */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Conditions d'utilisation
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Objet</h3>
                  <p className="text-gray-700">
                    Le présent site web a pour objet de présenter les services de transport 
                    en taxi proposés par Taxi VLB et de permettre la prise de contact avec 
                    notre entreprise pour effectuer des réservations.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Acceptation</h3>
                  <p className="text-gray-700">
                    L'utilisation de ce site implique l'acceptation pleine et entière des 
                    conditions générales d'utilisation décrites ci-après. Ces conditions 
                    d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Accès au site</h3>
                  <p className="text-gray-700">
                    L'accès au site est gratuit. Tous les coûts afférents à l'accès au site, 
                    que ce soient les frais matériels, logiciels ou d'accès à internet sont 
                    exclusivement à la charge de l'utilisateur.
                  </p>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Propriété intellectuelle
              </h2>
              <p className="text-gray-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale 
                sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
                reproduction sont réservés, y compris pour les documents téléchargeables et 
                les représentations iconographiques et photographiques.
              </p>
              <p className="text-gray-700">
                La reproduction de tout ou partie de ce site sur un support électronique 
                quel qu'il soit est formellement interdite sauf autorisation expresse de 
                l'éditeur. Les marques et logos reproduits sur ce site sont déposés par 
                les sociétés qui en sont propriétaires.
              </p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Responsabilité
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Contenu du site</h3>
                  <p className="text-gray-700">
                    Les informations contenues sur ce site sont aussi précises que possible 
                    et le site remis à jour à différentes périodes de l'année, mais peut 
                    toutefois contenir des inexactitudes ou des omissions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Utilisation du site</h3>
                  <p className="text-gray-700">
                    L'utilisateur s'engage à utiliser le site de manière loyale et à ne pas 
                    porter atteinte à l'ordre public et aux bonnes mœurs. Il s'interdit 
                    notamment de perturber le fonctionnement du site.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 Liens externes</h3>
                  <p className="text-gray-700">
                    Le site peut contenir des liens vers d'autres sites. Taxi VLB n'est pas 
                    responsable du contenu de ces sites externes.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Le site utilise des cookies pour améliorer l'expérience utilisateur et 
                analyser le trafic. Ces cookies ne collectent aucune information personnelle 
                identifiable.
              </p>
              <p className="text-gray-700">
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais 
                certaines fonctionnalités du site pourraient ne plus être disponibles.
              </p>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Protection des données personnelles
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée 
                et au Règlement Général sur la Protection des Données (RGPD), vous disposez 
                d'un droit d'accès, de rectification, de suppression et d'opposition aux 
                données personnelles vous concernant.
              </p>
              <p className="text-gray-700">
                Pour plus d'informations, consultez notre 
                <Link href="/politique-confidentialite" className="text-blue-600 hover:underline ml-1">
                  politique de confidentialité
                </Link>.
              </p>
            </section>

            {/* Conditions de transport */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Conditions de transport
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">9.1 Tarification</h3>
                  <p className="text-gray-700">
                    Les tarifs appliqués sont conformes à la réglementation en vigueur. 
                    Les tarifs de nuit, dimanches et jours fériés sont majorés selon 
                    la grille tarifaire officielle.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">9.2 Responsabilité transport</h3>
                  <p className="text-gray-700">
                    Taxi VLB est couvert par une assurance responsabilité civile professionnelle 
                    et dispose d'une assurance transport de personnes conforme à la réglementation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">9.3 Réclamations</h3>
                  <p className="text-gray-700">
                    Toute réclamation doit être adressée par écrit à l'adresse email : 
                    contact@taxi-verrieres-le-buisson.com dans un délai de 15 jours 
                    suivant la prestation.
                  </p>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Droit applicable et juridiction
              </h2>
              <p className="text-gray-700 mb-4">
                Tout litige en relation avec l'utilisation du site www.taxi-verrieres-le-buisson.com 
                est soumis au droit français. Il est fait attribution exclusive de juridiction 
                aux tribunaux compétents de Paris.
              </p>
              <p className="text-gray-700">
                En cas de litige relatif aux prestations de transport, les parties s'efforceront 
                de résoudre le différend à l'amiable. À défaut, le litige sera porté devant 
                les tribunaux compétents.
              </p>
            </section>

            {/* Médiation */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Médiation
              </h2>
              <p className="text-gray-700 mb-4">
                Conformément aux dispositions du Code de la consommation concernant le règlement 
                amiable des litiges, Taxi VLB adhère au Service du Médiateur du e-commerce de 
                la FEVAD (Fédération du e-commerce et de la vente à distance) dont les 
                coordonnées sont les suivantes :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Médiateur :</strong> FEVAD</p>
                <p className="text-gray-700"><strong>Site web :</strong> 
                  <a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    www.mediateurfevad.fr
                  </a>
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                Après démarche préalable écrite des consommateurs vis-à-vis de Taxi VLB, 
                le Service du Médiateur peut être saisi pour tout litige de consommation 
                dont le règlement n'aurait pas abouti.
              </p>
            </section>

            {/* Accessibilité */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Accessibilité
              </h2>
              <p className="text-gray-700 mb-4">
                Nous nous efforçons de rendre notre site web accessible à tous les utilisateurs, 
                y compris aux personnes en situation de handicap. Si vous rencontrez des 
                difficultés d'accès à notre site, n'hésitez pas à nous contacter.
              </p>
              <p className="text-gray-700">
                Notre flotte comprend des véhicules adaptés au transport de personnes à 
                mobilité réduite. Contactez-nous pour plus d'informations sur ces services.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Modifications des mentions légales
              </h2>
              <p className="text-gray-700">
                Taxi VLB se réserve le droit de modifier les présentes mentions légales 
                à tout moment. Il est conseillé de consulter régulièrement cette page 
                pour prendre connaissance des éventuelles modifications.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces mentions légales ou nos services :
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email :</strong> 
                  <a href="mailto:contact@taxi-verrieres-le-buisson.com" className="text-blue-600 hover:underline ml-2">
                    contact@taxi-verrieres-le-buisson.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Téléphone :</strong> 
                  <a href="tel:06XXXXXXXX" className="text-blue-600 hover:underline ml-2">
                    06 XX XX XX XX
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Adresse :</strong> Verrières-le-Buisson, 91370, France
                </p>
                <p className="text-gray-700">
                  <strong>Horaires :</strong> 24h/24, 7j/7
                </p>
              </div>
            </section>

            {/* Réglementation spécifique */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Réglementation spécifique aux taxis
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">14.1 Autorisation de stationnement</h3>
                  <p className="text-gray-700">
                    Taxi VLB dispose d'une autorisation de stationnement (ADS) délivrée 
                    par la commune de Verrières-le-Buisson, permettant l'exercice de 
                    l'activité de taxi sur le territoire communal et au-delà.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">14.2 Carte professionnelle</h3>
                  <p className="text-gray-700">
                    Le conducteur dispose d'une carte professionnelle de conducteur de 
                    taxi en cours de validité, délivrée par la Préfecture.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">14.3 Contrôle technique</h3>
                  <p className="text-gray-700">
                    Les véhicules de la flotte sont soumis à un contrôle technique 
                    annuel et respectent les normes de sécurité et d'équipement 
                    imposées par la réglementation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">14.4 Formation continue</h3>
                  <p className="text-gray-700">
                    Nos conducteurs suivent une formation continue obligatoire de 
                    14 heures tous les 5 ans pour maintenir leurs compétences 
                    professionnelles.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12 space-x-4">
            <Link 
              href="/politique-confidentialite" 
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Politique de confidentialité
            </Link>
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