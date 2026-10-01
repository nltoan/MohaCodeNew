import { Suspense, lazy, type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingFallback } from '@/components/LoadingFallback';
import { HomePage } from '@/pages';

const HoiQuyPage = lazy(() => import('@/pages/hoi-quy/HoiQuyPage').then(m => ({ default: m.HoiQuyPage })));
// Lazy load all pages
const AboutPage = lazy(() => import('@/pages/about/AboutPage').then((m) => ({ default: m.AboutPage })));
const AboutPageMis = lazy(() => import('@/pages/about/AboutPageMinius').then((m) => ({ default: m.AboutPage })));
const FunctionsAndDutiesPage = lazy(() =>
  import('@/pages/about/FunctionsAndDutiesPage').then((m) => ({
    default: m.FunctionsAndDutiesPage,
  })),
);

const FunctionsAndDutiesPageMinus = lazy(() =>
  import('@/pages/about/FunctionsAndDutiesPageMinus').then((m) => ({
    default: m.FunctionsAndDutiesPage,
  })),
);

const MinisterialLeadershipPage = lazy(() =>
  import('@/pages/about/MinisterialLeadershipPage').then((m) => ({
    default: m.MinisterialLeadershipPage,
  })),
);
const OrganizationalStructurePage = lazy(() =>
  import('@/pages/about/OrganizationalStructurePage').then((m) => ({
    default: m.OrganizationalStructurePage,
  })),
);
const HistoryAndDevelopmentPage = lazy(() =>
  import('@/pages/about/HistoryAndDevelopmentPage').then((m) => ({
    default: m.HistoryAndDevelopmentPage,
  })),
);

const NewsPage = lazy(() => import('@/pages/news/NewsPage').then((m) => ({ default: m.NewsPage })));
const MinisNewsPage = lazy(() => import('@/pages/minister-news/NewsPage').then((m) => ({ default: m.NewsPage })));
const NghiQuyetNewsPage = lazy(() => import('@/pages/nghiquyettw4-news/NewsPage').then((m) => ({ default: m.NewsPage })));

const NewsCategoryPage = lazy(() =>
  import('@/pages/news/NewsCategoryPage').then((m) => ({
    default: m.NewsCategoryPage,
  })),
);

const MinisNewsCategoryPage = lazy(() =>
  import('@/pages/minister-news/NewsCategoryPage').then((m) => ({
    default: m.NewsCategoryPage,
  })),
);

const NghiQuyetNewsCategoryPage = lazy(() =>
  import('@/pages/nghiquyettw4-news/NewsCategoryPage').then((m) => ({
    default: m.NewsCategoryPage,
  })),
);
const NewsDetailPage = lazy(() =>
  import('@/pages/news/NewsDetailPage').then((m) => ({
    default: m.NewsDetailPage,
  })),
);

const NewsDetailNotiPage = lazy(() =>
  import('@/pages/notifcation/NewsDetailPage').then((m) => ({
    default: m.NewsDetailPage,
  })),
);

const MinisNewsDetailPage = lazy(() =>
  import('@/pages/minister-news/NewsDetailPage').then((m) => ({
    default: m.NewsDetailPage,
  })),
);

const NghiQuyetNewsDetailPage = lazy(() =>
  import('@/pages/nghiquyettw4-news/NewsDetailPage').then((m) => ({
    default: m.NewsDetailPage,
  })),
);

const ScientificResearchPage = lazy(() =>
  import('@/pages/scientificresearch/ScientificResearchPage').then((m) => ({
    default: m.ScientificResearchPage,
  })),
);

const ScientificResearchDetailPage = lazy(() =>
  import('@/pages/scientificresearch/ScientificResearchDetailPage').then((m) => ({
    default: m.ScientificResearchDetailPage,
  })),
);

const DocumentPage = lazy(() =>
  import('@/pages/document/DocumentPage').then((m) => ({
    default: m.DocumentPage,
  })),
);
const DirectivesAndAdministrativeDocumentsPage = lazy(() =>
  import('@/pages/document/DirectivesAndAdministrativeDocumentsPage').then((m) => ({
    default: m.DirectivesAndAdministrativeDocumentsPage,
  })),
);

const DocumentDetailPage = lazy(() =>
  import('@/pages/document/DocumentDetailPage').then((m) => ({
    default: m.DocumentDetailPage,
  })),
);

const DraftLegalDetailPage = lazy(() =>
  import('@/pages/document/DraftLegalDetailPage').then((m) => ({
    default: m.DraftLegalDetailPage,
  })),
);

const LegalNormativeDocumentsPage = lazy(() =>
  import('@/pages/document/LegalNormativeDocumentsPage').then((m) => ({
    default: m.LegalNormativeDocumentsPage,
  })),
);
const DraftLegalDocumentsPage = lazy(() =>
  import('@/pages/document/DraftLegalDocumentsPage').then((m) => ({
    default: m.DraftLegalDocumentsPage,
  })),
);
const DataPage = lazy(() => import('@/pages/data/DataPage').then((m) => ({ default: m.DataPage })));
const PhotoGalleryPage = lazy(() =>
  import('@/pages/multimedia/PhotoGalleryPage').then((m) => ({
    default: m.PhotoGalleryPage,
  })),
);
const PhotoAlbumDetailPage = lazy(() =>
  import('@/pages/multimedia/PhotoAlbumDetailPage').then((m) => ({
    default: m.PhotoAlbumDetailPage,
  })),
);
const VideoAlbumDetailPage = lazy(() =>
  import('@/pages/multimedia/VideoAlbumDetailPage').then((m) => ({
    default: m.VideoAlbumDetailPage,
  })),
);
const AudioAlbumDetailPage = lazy(() =>
  import('@/pages/multimedia/AudioAlbumDetailPage').then((m) => ({
    default: m.AudioAlbumDetailPage,
  })),
);
const VideoGalleryPage = lazy(() =>
  import('@/pages/multimedia/VideoGalleryPage').then((m) => ({
    default: m.VideoGalleryPage,
  })),
);
const AudioGalleryPage = lazy(() =>
  import('@/pages/multimedia/AudioGalleryPage').then((m) => ({
    default: m.AudioGalleryPage,
  })),
);
const FeedbackAndRecommendationsPage = lazy(() =>
  import('@/pages/feedback/FeedbackAndRecommendationsPage').then((m) => ({
    default: m.FeedbackAndRecommendationsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/common/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  })),
);

const SearchPage = lazy(() =>
  import('@/pages/search/search').then((m) => ({
    default: m.SearchPage,
  })),
);

const MinisterHomePage = lazy(() => import('@/pages/minister/home/MinisterHomePage').then((m) => ({ default: m.MinisterHomePage })))
const NghiQuyetHomePage = lazy(() => import('@/pages/nghiquyettw4/home/NghiQuyetTW4HomePage').then((m) => ({ default: m.NghiQuyetTW4HomePage })))

const withSuspense = (Component: FC) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const ministerRouters = [
  {
    element: <Outlet />,
    children: [
      {
        index: true,
        element: withSuspense(() => <MinisterHomePage />),
      },
      {
        path: 'trang-chu',
        element: withSuspense(() => <MinisterHomePage />),
      },
      {
        path: 'gioi-thieu-bo-truong',
        element: withSuspense(() => <AboutPageMis />),
        children: [
          {
            index: true,
            element: withSuspense(() => <FunctionsAndDutiesPageMinus />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <FunctionsAndDutiesPageMinus />),
          },
        ]
      },
      {
        path: 'tin-tuc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <MinisNewsPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <MinisNewsDetailPage />),
          },
        ],
      },
      {
        path: 'chuyen-muc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <MinisNewsCategoryPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <MinisNewsCategoryPage />),
          },
        ],
      },

    ]

  }
]

export const nghiquyettw4Routers = [
  {
    element: <Outlet />,
    children: [
      {
        index: true,
        element: withSuspense(() => <NghiQuyetHomePage />),
      },
      {
        path: 'trang-chu',
        element: withSuspense(() => <NghiQuyetHomePage />),
      },
      {
        path: 'tin-tuc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <NghiQuyetNewsPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <NghiQuyetNewsDetailPage />),
          },
        ],
      },
      {
        path: 'chuyen-muc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <NghiQuyetNewsCategoryPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <NghiQuyetNewsCategoryPage />),
          },
        ],
      },

    ]

  }
]

export const appRoutes = [
  {
    element: <Outlet />,
    children: [
      // Home
      {
        index: true,
        element: withSuspense(() => <HomePage />),
      },
      {
        path: 'trang-chu',
        element: withSuspense(() => <HomePage />),
      },

      // About
      {
        path: 'gioi-thieu',
        element: withSuspense(() => <AboutPage />),
        children: [
          {
            index: true,
            element: withSuspense(() => <FunctionsAndDutiesPage />),
          },
          {
            path: 'chuc-nang-nhiem-vu/:slug',
            element: withSuspense(() => <FunctionsAndDutiesPage />),
          },
          {
            path: 'lich-su-bo/:slug',
            element: withSuspense(() => <FunctionsAndDutiesPage />),
          },
          {
            path: 'lanh-dao-bo/:slug',
            element: withSuspense(() => <MinisterialLeadershipPage />),
          },
          {
            path: 'co-cau-to-chuc/:slug',
            element: withSuspense(() => <OrganizationalStructurePage />),
          },
          {
            path: 'lich-su-hinh-thanh-va-phat-trien',
            element: withSuspense(() => <HistoryAndDevelopmentPage />),
          },
        ],
      },
      {
        path: 'tra-cuu-hoi-quy',
        element: withSuspense(HoiQuyPage),
      },
      {
        path: 'tim-kiem',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <SearchPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <SearchPage />),
          },
        ],
      },
      // News
      {
        path: 'tin-tuc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <NewsPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <NewsDetailPage />),
          },
        ],
      },
      {
        path: 'thong-bao',
        element: <Outlet />,
        children: [
          {
            path: ':slug',
            element: withSuspense(() => <NewsDetailNotiPage />),
          },
        ],
      },

      {
        path: 'chuyen-muc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <NewsCategoryPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <NewsCategoryPage />),
          },
        ],
      },

      // ScientificResearch
      {
        path: 'nghien-cuu-khoa-hoc',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <ScientificResearchPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <ScientificResearchDetailPage />),
          }
        ],
      },

      // Documents
      {
        path: 'van-ban',
        element: withSuspense(() => <DocumentPage />),
        children: [
          {
            index: true,
            element: withSuspense(() => <DirectivesAndAdministrativeDocumentsPage />),
          },
          {
            path: 'van-ban-chi-dao/:slug',
            element: withSuspense(() => <DirectivesAndAdministrativeDocumentsPage />),
          },
          {
            path: 'van-ban-qppl/:slug',
            element: withSuspense(() => <LegalNormativeDocumentsPage />),
          },
          {
            path: 'du-thao-van-ban',
            element: withSuspense(() => <DraftLegalDocumentsPage />),
          },
          {
            path: 'du-thao/:slug',
            element: withSuspense(() => <DraftLegalDetailPage />),
          },
          {
            path: ':slug',
            element: withSuspense(() => <DocumentDetailPage />)
          }
        ],
      },

      // Data
      {
        path: 'du-lieu',
        element: withSuspense(() => <DataPage />),
      },

      // Multimedia
      {
        path: 'multimedia',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <PhotoGalleryPage />),
          },
          {
            path: 'photo',
            element: withSuspense(() => <PhotoGalleryPage />)
          },
          {
            path: 'video',
            element: withSuspense(() => <VideoGalleryPage />),
          },
          {
            path: 'audio',
            element: withSuspense(() => <AudioGalleryPage />),
          },
        ],
      },
      {
        path: 'photo',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <PhotoGalleryPage />),
          },
          {
            path: ":slug",
            element: withSuspense(() => <PhotoAlbumDetailPage />)
          }
        ]
      },
      {
        path: 'video',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <VideoGalleryPage />),
          },
          {
            path: ":slug",
            element: withSuspense(() => <VideoAlbumDetailPage />)
          }
        ]
      },
      {
        path: 'audio',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: withSuspense(() => <AudioGalleryPage />),
          },
          {
            path: ":slug",
            element: withSuspense(() => <AudioAlbumDetailPage />)
          }
        ]
      },

      // Feedback
      {
        path: 'phan-anh-kien-nghi',
        element: withSuspense(() => <FeedbackAndRecommendationsPage />),
      },

      // 404
      {
        path: '*',
        element: withSuspense(() => <NotFoundPage />),
      },
    ],
  },
];

