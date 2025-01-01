import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Post } from "@/data/posts";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

export default function MapWithMarkers() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    });

    map.current.on("load", async () => {
      console.log("Map loaded successfully");

      try {
        // Veriyi API'den çek
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const fetchedPosts: Post[] = await response.json();

        const bounds = new mapboxgl.LngLatBounds();

        // Marker ve Popup Ekle
        fetchedPosts.forEach((post) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div>
              <img src="${post.imageUrl}" alt="${post.name}" style="width: 100%; max-width: 200px; height: auto;" />
              <h3 style="margin-top: 10px; font-weight: bold;">${post.name}</h3>
              <p>${post.description}</p>
            </div>
          `);

          new mapboxgl.Marker()
            .setLngLat([post.longitude, post.latitude])
            .setPopup(popup)
            .addTo(map.current!);

          bounds.extend([post.longitude, post.latitude]);
        });

        // Haritayı marker'lara göre ayarla ve zoom oranını azalt
        map.current.fitBounds(bounds, { padding: 100, maxZoom: 10 }); // maxZoom ile daha az yakınlaştırma
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Harita yüksekliği artırıldı
  return <div ref={mapContainer} style={{ width: "100%", height: "700px" }} />;
}
