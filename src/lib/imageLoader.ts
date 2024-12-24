//"use server";

// Docs: https://developers.cloudflare.com/images/transform-images
export default function cloudflareLoader({
    src,
    width,
    quality,
}: { src: string; width: number; quality?: number }) {
    const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
    return `https://www.roaport.com/cdn-cgi/image/${params.join(',')}/${src}`
  }