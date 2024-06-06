import {
  type ErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const routeError = useRouteError();

  if (isRouteErrorResponse(routeError)) {
    const response = routeError as ErrorResponse;
    return (
      <>
        <h1>{response.status}</h1>
        <p>{response.statusText}</p>
      </>
    );
  }
  const error = routeError as Error;
  return (
    <>
      <h1>ERROR!</h1>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </>
  );
}
