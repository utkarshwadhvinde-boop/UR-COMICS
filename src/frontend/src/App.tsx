import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-load pages
const HomePage = lazy(() => import("./pages/Home"));
const ReaderPage = lazy(() => import("./pages/Reader"));
const CreatePage = lazy(() => import("./pages/Create"));
const CreatorDashboardPage = lazy(() => import("./pages/CreatorDashboard"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfile"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const CoinsPage = lazy(() => import("./pages/Coins"));
const FAQPage = lazy(() => import("./pages/FAQ"));
const AdminPage = lazy(() => import("./pages/Admin"));
const OwnerPage = lazy(() => import("./pages/Owner"));
const TrendingPage = lazy(() => import("./pages/Trending"));
const LibraryPage = lazy(() => import("./pages/Library"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-8">
        <Skeleton className="h-8 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: TrendingPage,
});
const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: LibraryPage,
});
const readerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/read/$comicId/$chapterId",
  component: ReaderPage,
});
const createRoute_ = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: CreatePage,
});
const creatorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator-dashboard",
  component: CreatorDashboardPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const publicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$userId",
  component: PublicProfilePage,
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});
const coinsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/coins",
  component: CoinsPage,
});
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: OwnerPage,
});
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  trendingRoute,
  libraryRoute,
  readerRoute,
  createRoute_,
  creatorDashboardRoute,
  profileRoute,
  publicProfileRoute,
  notificationsRoute,
  coinsRoute,
  faqRoute,
  privacyRoute,
  adminRoute,
  ownerRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
