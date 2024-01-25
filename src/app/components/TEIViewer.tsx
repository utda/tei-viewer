export default function MiradorViewer({
  isVertical,
  fontSize,
}: Readonly<{
  isVertical: boolean;
  fontSize: number;
}>) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
        fontSize: `${fontSize}px`, // スタイルにfontSizeを追加
      }}
      id="TEI"
      className="p-4"
    ></div>
  );
}
