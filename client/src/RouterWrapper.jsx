import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import API from "./services/api.js";
import App from "./App.jsx";
import Home from "./components/Home.jsx";
import Loader from "./components/Loader.jsx";
import RootErrorBoundary from "./components/RootErrorBoundary.jsx";

// Lazy load components
const SignUp = lazy(() => import("./components/SignUp.jsx"));
const SignIn = lazy(() => import("./components/SignIn.jsx"));
const VideoPlayer = lazy(() => import("./components/VideoPlayer.jsx"));
const ChannelPage = lazy(() => import("./components/ChannelPage.jsx"));
const PageNotFound = lazy(() => import("./components/PageNotFound.jsx"));
const VideoNotFound = lazy(() => import("./components/VideoNotFound.jsx"));
const ChannelNotFound = lazy(() => import("./components/ChannelNotFound.jsx"));
import { useAuth } from "./context/AuthContext.jsx";

export default function RouterWrapper() {
  const { authUser } = useAuth();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/signup",
          element: (
            <Suspense fallback={<Loader size="lg" />}>
              <SignUp />
            </Suspense>
          ),
        },
        {
          path: "/signin",
          element: (
            <Suspense fallback={<Loader size="lg" />}>
              <SignIn />
            </Suspense>
          ),
        },
        {
          path: "/watch/:videoId",
          element: (
            <Suspense fallback={<Loader size="lg" />}>
              <VideoPlayer />
            </Suspense>
          ),
          errorElement: <VideoNotFound />,
          loader: async ({ params }) => {
            try {
              await API.get(`/videos/${params.videoId}/exist`);
              return null;
            } catch (error) {
              throw new Response(null, { status: 404 });
            }
          },
        },
        {
          path: "/channel/:channelId",

          element: (
            <Suspense fallback={<Loader size="lg" />}>
              <ChannelPage />
            </Suspense>
          ),
          errorElement: <ChannelNotFound />,
          loader: async ({ params }) => {
            try {
              if (authUser?.id === params.channelId) {
                return null;
              }
              await API.get(`/channels/${params.channelId}/exist`);
              return null;
            } catch (error) {
              throw new Response(null, {
                status: error?.response?.data.statusCode,
              });
            }
          },
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<Loader size="lg" />}>
              <PageNotFound />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}
