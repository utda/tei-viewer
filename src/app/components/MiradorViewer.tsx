export default function MiradorViewer({
  manifest,
}: Readonly<{
  manifest: string;
}>) {
  return (
    <iframe
      width="100%"
      height="100%"
      src={`/tei-viewer/mirador/index.html?manifest=${manifest}`}
      title="Mirador Viewer"
      style={{ border: "none" }}
      className="hidden md:block"
    ></iframe>
  );
}
