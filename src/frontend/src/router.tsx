import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-load pages
const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const ComicDetailPage = lazy(() =>
  import("@/pages/ComicDetail").then((m) => ({ default: m.ComicDetailPage })),
);
const ReaderPage = lazy(() =>
  import("@/pages/Reader").then((m) => ({ default: m.ReaderPage })),
);
const CreatorDashboardPage = lazy(() =>
  import("@/pages/creator/Dashboard").then((m) => ({
    default: m.CreatorDashboardPage,
  })),
);
const CreateComicPage = lazy(() => import("@/pages/creator/CreateComic"));
const EditComicPage = lazy(() =>
  import("@/pages/creator/EditComic").then((m) => ({
    default: m.EditComicPage,
  })),
);
const CreateChapterPage = lazy(() =>
  import("@/pages/creator/CreateChapter").then((m) => ({
    default: m.CreateChapterPage,
  })),
);
const EditChapterPage = lazy(() =>
  import("@/pages/creator/EditChapter").then((m) => ({
    default: m.EditChapterPage,
  })),
);
const TrendingPage = lazy(() =>
  import("@/pages/Trending").then((m) => ({ default: m.TrendingPage })),
);
const FaqPage = lazy(() =>
  import("@/pages/Faq").then((m) => ({ default: m.FaqPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.ProfilePage })),
);
const EditProfilePage = lazy(() =>
  import("@/pages/EditProfile").then((m) => ({ default: m.EditProfilePage })),
);
const PrivacyPolicyPage = lazy(() =>
  import("@/pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicyPage })),
);

function RootComponent() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
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

// Protected creator routes
function CreatorGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

const creatorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator",
  component: () => (
    <CreatorGuard>
      <CreatorDashboardPage />
    </CreatorGuard>
  ),
});

const createComicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/new",
  component: () => (
    <CreatorGuard>
      <CreateComicPage />
    </CreatorGuard>
  ),
});

const editComicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId",
  component: () => (
    <CreatorGuard>
      <EditComicPage />
    </CreatorGuard>
  ),
});

const createChapterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId/chapters/new",
  component: () => (
    <CreatorGuard>
      <CreateChapterPage />
    </CreatorGuard>
  ),
});

const editChapterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator/comics/$comicId/chapters/$chapterId",
  component: () => (
    <CreatorGuard>
      <EditChapterPage />
    </CreatorGuard>
  ),
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: TrendingPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$handle",
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$handle/edit",
  component: () => (
    <CreatorGuard>
      <EditProfilePage />
    </CreatorGuard>
  ),
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
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
  privacyPolicyRoute
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
