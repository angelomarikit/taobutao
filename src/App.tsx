import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useOutletContext, useParams } from "react-router-dom";
import { ContactProvider } from "@/components/ContactDialog";
import { GalleryAssistant } from "@/components/GalleryAssistant";
import { Footer, Navigation } from "@/components/SiteChrome";
import { useSiteContent } from "@/lib/content";
import { AboutPage } from "@/pages/AboutPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { ArtworkPage } from "@/pages/ArtworkPage";
import { ArtistPage } from "@/pages/ArtistPage";
import { CollectionPage } from "@/pages/CollectionPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { HomePage } from "@/pages/HomePage";
import { JournalPage } from "@/pages/JournalPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminApp } from "@/admin/AdminApp";
import type { SiteContent } from "@/types";
//testing only
function PublicShell() {
  const state = useSiteContent();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <ContactProvider copy={state.content.copy}>
      <Navigation copy={state.content.copy} artists={state.content.artists} artworks={state.content.artworks} articles={state.content.articles} />
      <div className="page-enter">
        <Outlet context={state.content} />
      </div>
      <Footer copy={state.content.copy} />
      <GalleryAssistant copy={state.content.copy} />
    </ContactProvider>
  );
}

function useContent() {
  return useOutletContext<SiteContent>();
}

function HomeRoute() {
  const content = useContent();
  return <HomePage artworks={content.artworks} articles={content.articles} exhibitions={content.exhibitions} copy={content.copy} />;
}

function GalleryRoute() {
  return <GalleryPage artworks={useContent().artworks} />;
}

function ArtworkRoute() {
  const { artworks } = useContent();
  const { slug } = useParams();
  const index = artworks.findIndex((artwork) => artwork.slug === slug);
  const artwork = artworks[index];
  if (!artwork) return <NotFoundPage />;
  const next = artworks[(index + 1) % artworks.length];
  return <ArtworkPage artwork={artwork} next={next?.id === artwork.id ? undefined : next} />;
}

function JournalRoute() {
  return <JournalPage articles={useContent().articles} />;
}

function ArticleRoute() {
  const { articles } = useContent();
  const { slug } = useParams();
  const index = articles.findIndex((article) => article.slug === slug);
  const article = articles[index];
  if (!article) return <NotFoundPage />;
  const next = articles[(index + 1) % articles.length];
  return <ArticlePage article={article} next={next?.id === article.id ? undefined : next} />;
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route index element={<HomeRoute />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="gallery" element={<GalleryRoute />} />
        <Route path="gallery/artists/:slug" element={<ArtistPage />} />
        <Route path="gallery/collections/:slug" element={<CollectionPage />} />
        <Route path="gallery/:slug" element={<ArtworkRoute />} />
        <Route path="journal" element={<JournalRoute />} />
        <Route path="journal/:slug" element={<ArticleRoute />} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin/*" element={<AdminApp />} />
      <Route path="home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
