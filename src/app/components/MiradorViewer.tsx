export default function MiradorViewer({
  manifest,
}: Readonly<{
  manifest: string;
}>) {
  const prefixPath = process.env.prefixPath;
  return (
    <iframe
      width="100%"
      height="100%"
      src={`${prefixPath}/mirador/index.html?manifest=${manifest}`}
      title="Mirador Viewer"
      style={{ border: "none" }}
      className="hidden md:block"
    ></iframe>
  );
}
