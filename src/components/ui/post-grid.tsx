"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Post } from "@/data/posts"
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLocale } from '@/i18n'
import { formatDate } from '@/lib/language'
import { useEffect, useState } from "react"

export function PostGrid() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await fetch('/api/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadPosts();
    }, []);

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading posts...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                <HomePageTitle />
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

// Client component for title with translations
function HomePageTitle() {
    const pathname = usePathname() || '';
    const locale = getLocale(pathname);
    
    const titles = {
        en: "Uploaded Images",
        tr: "Yüklenen Görüntüler"
    };
    
    return <>{titles[locale]}</>;
}

// Client component for PostCard with translations
function PostCard({ post }: { post: Post }) {
    const pathname = usePathname() || '';
    const locale = getLocale(pathname);
    
    const translations = {
        en: {
            location: "Location",
            type: "Type",
            description: "Description",
            dateCreated: "Date Created",
            dateVerified: "Date Verified",
            notVerified: "Not Verified"
        },
        tr: {
            location: "Konum",
            type: "Tür",
            description: "Açıklama",
            dateCreated: "Oluşturulma Tarihi",
            dateVerified: "Doğrulanma Tarihi",
            notVerified: "Doğrulanmadı"
        }
    };
    
    const t = translations[locale];
    
    return (
        <Link href={`/${locale}/posts/${post.id}`}>
            <Card>
                <CardHeader className="p-0">
                    <AspectRatio ratio={4 / 3}>
                        <Image
                            src={post.imageUrl}
                            alt={post.name}
                            fill
                            className="object-cover rounded-t-lg"
                            loader={({ src, width, quality }) => {
                                const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto'];
                                return `https://roaport.com/cdn-cgi/image/${params.join(',')}/${src}`;
                            }}
                        />
                    </AspectRatio>
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{post.username}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>{t.location}:</strong> ({post.longitude.toFixed(4)}, {post.latitude.toFixed(4)})
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>{t.type}:</strong> {post.type}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                        <strong>{t.description}:</strong> {post.description}
                    </p><p className="text-sm text-muted-foreground mb-1">
                        <strong>{t.dateCreated}:</strong> {formatDate(post.dateCreated, locale)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>{t.dateVerified}:</strong> {post.verified != "" ? formatDate(post.verified, locale) : t.notVerified}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

