import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy,Suspense } from "react";
import { PageLoader } from "./components/LoadingSpinner";
import { Layout } from "./components/Layout";

const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const TrendingPage = lazy(() =>
  import("@/pages/Trending").then((m) => ({ default: m.TrendingPage })),
);
const ComicDetailPage = lazy(() =>
  import("@/pages/ComicDetail").then((m) => ({ default: m.ComicDetailPage })),
);
const ReaderPage = lazy(() =>
  import("@/pages/Reader").then((m) => ({ default: m.ReaderPage })),
);
const CreatorDashboard = lazy(() =>
  import("@/pages/creator/Dashboard").then((m) => ({ default: m.CreatorDashboard })),
);
const CreateComicPage = lazy(() =>
  import("@/pages/creator/CreateComic").then((m) => ({ default: m.CreateComicPage })),
);
const EditComicPage = lazy(() =>
  import("@/pages/creator/EditComic").then((m) => ({ default: m.EditComicPage })),
);
const CreateChapterPage = lazy(() =>
  import("@/pages/creator/CreateChapter").then((m) => ({ default: m.CreateChapterPage })),
);
const EditChapterPage = lazy(() =>
  import("@/pages/creator/EditChapter").then((m) => ({ default: m.EditChapterPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.ProfilePage })),
);
const EditProfilePage = lazy(() =>
  import("@/pages/EditProfile").then((m) => ({ default: m.EditProfilePage })),
);
const FaqPage = lazy(() =>
  import("@/pages/Faq").then((m) => ({ default: m.FaqPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import("@/pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicyPage })),
);
const TermsAndConditionsPage = lazy(() =>
  import("@/pages/TermsAndConditions").then((m) => ({ default: m.TermsAndConditionsPage })),
);
const GenrePage = lazy(() =>
  import("@/pages/Genre").then((m) => ({ default: m.GenrePage })),
);
const NovelListPage = lazy(() =>
  import("@/pages/NovelList").then((m) => ({ default: m.NovelListPage })),
);
const NovelDetailPage = lazy(() =>
  import("@/pages/NovelDetail").then((m) => ({ default: m.NovelDetailPage })),
);
const NovelReaderPage = lazy(() =>
  import("@/pages/NovelReader").then((m) => ({ default: m.NovelReaderPage })),
);
const CreateNovelPage = lazy(() =>
  import("@/pages/creator/CreateNovel").then((m) => ({ default: m.CreateNovelPage })),
);
const EditNovelChapterPage = lazy(() =>
  import("@/pages/creator/EditNovelChapter").then((m) => ({ default: m.EditNovelChapterPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/AdminDashboard").then((m) => ({ default: m.AdminDashboardPage })),
);

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: TrendingPage,
});

const comicDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comics/$comicId",
  component: ComicDetailPage,
});

const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/comics/$comicId/chapters/$chapterId",
  component: ReaderPage,
});

const creatorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator",
  component: CreatorDashboard,
});

const createComicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/new",
  component: CreateComicPage,
});

const editComicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId",
  component: EditComicPage,
});

const createChapterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId/chapters/new",
  component: CreateChapterPage,
});

const editChapterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId/chapters/$chapterId",
  component: EditChapterPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$handle",
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/edit",
  component: EditProfilePage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsAndConditionsPage,
});

const genreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/genre/$genreId",
  component: GenrePage,
});

const novelListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/novels",
  component: NovelListPage,
});

const novelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/novels/$novelId",
  component: NovelDetailPage,
});

const novelReaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/novels/$novelId/chapters/$chapterId",
  component: NovelReaderPage,
});

const createNovelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/novels/new",
  component: CreateNovelPage,
});

const editNovelChapterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/novels/$novelId/chapters/$chapterId",
  component: EditNovelChapterPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  comicDetailRoute,
  readerRoute,
  creatorDashboardRoute,
  createComicRoute,
  editComicRoute,
  createChapterRoute,
  editChapterRoute,
  trendingRoute,
  faqRoute,
  profileRoute,
  editProfileRoute,
  privacyPolicyRoute,
  termsRoute,
  adminRoute,
  genreRoute,
  novelListRoute,
  novelDetailRoute,
  novelReaderRoute,
  createNovelRoute,
  editNovelChapterRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
    }
