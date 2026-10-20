// Content model: verified company information from the supplied company profile.
export function createCompany(t) {
  return {
    name: t('JYD Corporation Co., Ltd.'),
    email: 'Info@jydcorp.com',
    phone: '064-445-3944',
    contact: t('Jane'),
    address: t('310/78 Nong Kham, Si Racha, Chon Buri, Thailand'),
    services: [
      {
        icon: 'Globe2',
        title: t('Import & Export'),
        en: 'Import & Export',
        text: t(
          'Connect your international trade by sea, air and land, with transport planning suited to your cargo.',
        ),
        detail: t(
          'Coordination with suppliers, factories, overseas agents, shipping lines and airlines, from checking cargo details to scheduling transport.',
        ),
        tags: ['Sea freight', 'Air freight', 'Land transport'],
      },
      {
        icon: 'FileCheck2',
        title: t('Customs Clearance'),
        en: 'Customs Clearance',
        text: t('Preparation, checking and clearance procedures for both imports and exports.'),
        detail: t(
          'Document checks, customs declarations, initial advice on tariff classification and duties, and coordination of cargo inspection and release.',
        ),
        tags: ['Import clearance', 'Export clearance', 'Documentation'],
      },
      {
        icon: 'Truck',
        title: t('Domestic Transportation'),
        en: 'Domestic Transportation',
        text: t(
          'Cargo collection and delivery between ports, airports, factories and warehouses, with vehicles suited to the job.',
        ),
        detail: t(
          'Options include 4-wheel, 6-wheel and 10-wheel trucks, tractor units, box trucks and trailers, with route planning and delivery coordination.',
        ),
        tags: ['Container trucking', 'Factory delivery', 'Warehouse delivery'],
      },
      {
        icon: 'MessagesSquare',
        title: t('Trade Consultation'),
        en: 'Trade Consultation',
        text: t(
          'Start with confidence, with guidance on procedures, documents and requirements for each cargo type.',
        ),
        detail: t(
          'Advice before importing or exporting, including required documents, key considerations and suitable transport options.',
        ),
        tags: ['Planning', 'Requirements', 'Consultation'],
      },
      {
        icon: 'Files',
        title: t('Trade Documentation'),
        en: 'Trade Documentation',
        text: t(
          'Careful preparation and review of key documents to meet the requirements of the relevant authorities.',
        ),
        detail: t(
          'Review of commercial invoices, packing lists, bills of lading, air waybills, certificates of origin and cargo-specific supporting documents.',
        ),
        tags: ['Invoice', 'Packing list', 'Bill of lading'],
      },
      {
        icon: 'Warehouse',
        title: t('Cargo Coordination'),
        en: 'Cargo Coordination',
        text: t(
          'Port, airport and warehouse coordination, with progress updates and support for on-site issues.',
        ),
        detail: t(
          'Coordination of collection, customs release, warehousing, cargo withdrawal, container status and returns to keep operations moving smoothly.',
        ),
        tags: ['Port', 'Airport', 'Warehouse'],
      },
    ],
    gallery: [
      {
        src: '/images/work-1.jpg',
        title: t('Care at every step of transportation'),
        category: 'transport',
        label: 'TRANSPORTATION',
      },
      {
        src: '/images/work-2.jpg',
        title: t('Cargo handled with care'),
        category: 'operations',
        label: 'CARGO OPERATIONS',
      },
      {
        src: '/images/work-3.jpg',
        title: t('Coordination on the ground'),
        category: 'operations',
        label: 'ON-SITE COORDINATION',
      },
      {
        src: '/images/work-4.jpg',
        title: t('Confidence delivered to your destination'),
        category: 'transport',
        label: 'DOMESTIC DELIVERY',
      },
    ],
  }
}
