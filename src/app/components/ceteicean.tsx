"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CeteiceanContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const teiFileUrl =
      searchParams.get("u") ||
      "https://kouigenjimonogatari.github.io/tei/01.xml";

    import("CETEIcean").then((CETEI) => {
      var CETEIcean = new CETEI.default();
      CETEIcean.getHTML5(teiFileUrl, function (data: any) {
        const teiElement = document.getElementById("TEI");
        if (teiElement) {
          teiElement.innerHTML = ""; // Clear existing content

          // Remove tei-facsimile elements from data
          const facsimileElements = data.querySelectorAll("tei-facsimile");
          facsimileElements.forEach((el: { remove: () => any }) => el.remove());

          teiElement.appendChild(data);
        }
      });
    });
  }, [searchParams]);

  return <div id="TEI"></div>;
}

export default function Ceteicean() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CeteiceanContent />
    </Suspense>
  );
}
