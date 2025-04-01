'use client'

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { approveReport, rejectReport } from "@/actions/report-actions";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/language";

interface Post {
  id: string;
  name: string;
  imageUrl: string;
  username: string;
  longitude: number;
  latitude: number;
  type: string;
  description: string;
  dateCreated: string;
  verified: string | null;
}

export function InteractivePostDetail({ post, locale }: { post: Post; locale: string }) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const router = useRouter();

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

  const t = translations[locale as keyof typeof translations];

  const handleApprove = async () => {
    await approveReport(parseInt(post.id));
    setIsApproveDialogOpen(false);
    router.refresh();
  };

  const handleReject = async () => {
    await rejectReport(parseInt(post.id));
    router.refresh();
  };

  return (
    <>
      <Card className="w-full max-w-3xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="p-0 relative group">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={post.imageUrl}
              alt={post.name}
              fill
              className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-lg font-semibold">{post.name}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="text-3xl font-bold mb-6">{post.username}</CardTitle>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.location}</h3>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  ({post.longitude.toFixed(4)}, {post.latitude.toFixed(4)})
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.type}</h3>
              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span>{post.type}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{t.description}</h3>
              <p className="text-sm text-muted-foreground">{post.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Date Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{t.dateCreated}: {formatDate(post.dateCreated, locale)}</span>
                </div>
                {post.verified && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t.dateVerified}: {formatDate(post.verified, locale)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 p-6">
          <Button variant="outline" className="w-28" onClick={handleReject}>
            Reject
          </Button>
          <Button variant="default" className="w-28" onClick={() => setIsApproveDialogOpen(true)}>
            Approve
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this hazard report?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
