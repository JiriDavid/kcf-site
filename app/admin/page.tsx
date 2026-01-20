"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Event, Sermon, GalleryItem } from "@/types";
import SectionHeader from "@/app/components/section-header";
import Loading from "@/app/components/ui/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Plus, Save, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, sermonsRes, galleryRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/sermons"),
          fetch("/api/gallery-metadata"),
        ]);

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }

        if (sermonsRes.ok) {
          const sermonsData = await sermonsRes.json();
          setSermons(sermonsData);
        }

        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGallery(galleryData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const counts = useMemo(
    () => ({
      events: events.length,
      sermons: sermons.length,
      gallery: gallery.length,
    }),
    [events.length, sermons.length, gallery.length]
  );

  // Check authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Redirecting to sign in...</div>
      </div>
    );
  }

  const handleEventSubmit = async (form: HTMLFormElement) => {
    setSaving(true);
    setUploadProgress("");
    try {
      const data = new FormData(form);

      // Handle file uploads first
      let uploadedUrls: string[] = [];
      const files = data.getAll("files") as File[];
      const hasFilesToUpload = files.some((file) => file.size > 0);

      if (hasFilesToUpload) {
        console.log(`Attempting to upload ${files.length} files`);
        setUploadProgress("Uploading event media...");
        const uploadFormData = new FormData();
        uploadFormData.append("type", "events");
        files.forEach((file) => {
          if (file.size > 0) {
            uploadFormData.append("files", file);
          }
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        console.log("Upload response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error("Upload failed:", errorData);
          throw new Error(errorData.error || "Failed to upload files");
        }

        const uploadResult = await uploadResponse.json();
        console.log("Upload result:", uploadResult);
        uploadedUrls = uploadResult.urls || [];

        if (uploadedUrls.length === 0) {
          throw new Error("Upload completed but no file URLs were returned");
        }

        setUploadProgress(
          `Uploaded ${uploadResult.count} file${uploadResult.count > 1 ? "s" : ""}`
        );
      }

      // Use uploaded file URL or provided URL
      const imageUrl =
        uploadedUrls.length > 0
          ? uploadedUrls[0] // Use first uploaded file as main image
          : String(
              data.get("image") ||
                "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80"
            );

      const newEvent = {
        title: String(data.get("title") || "Untitled Event"),
        date: String(data.get("date") || new Date().toISOString().slice(0, 10)),
        location: String(data.get("location") || "TBD"),
        description: String(data.get("description") || ""),
        image: imageUrl,
        category: (data.get("category") as Event["category"]) || "Conference",
        featured: false,
        // Store additional uploaded files if any
        mediaUrls: uploadedUrls.length > 1 ? uploadedUrls.slice(1) : undefined,
      };

      setUploadProgress("Saving event...");
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setEvents((prev) => [createdEvent, ...prev]);
        form.reset();
        toast.success("Event created successfully");
        setUploadProgress("");
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
      setUploadProgress("");
    } finally {
      setSaving(false);
    }
  };

  const handleSermonSubmit = async (form: HTMLFormElement) => {
    setSaving(true);
    setUploadProgress("");
    try {
      const data = new FormData(form);

      // Handle individual file uploads
      const uploadPromises: Promise<{ type: string; urls: string[] }>[] = [];

      // Upload thumbnail
      const thumbnailFile = data.get("thumbnailFile") as File;
      if (thumbnailFile && thumbnailFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("type", "sermons");
        uploadFormData.append("files", thumbnailFile);
        uploadPromises.push(
          fetch("/api/upload", { method: "POST", body: uploadFormData })
            .then((res) => res.json())
            .then((result) => ({ type: "thumbnail", urls: result.urls }))
        );
      }

      // Upload video
      const videoFile = data.get("videoFile") as File;
      if (videoFile && videoFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("type", "sermons");
        uploadFormData.append("files", videoFile);
        uploadPromises.push(
          fetch("/api/upload", { method: "POST", body: uploadFormData })
            .then((res) => res.json())
            .then((result) => ({ type: "video", urls: result.urls }))
        );
      }

      // Upload audio
      const audioFile = data.get("audioFile") as File;
      if (audioFile && audioFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("type", "sermons");
        uploadFormData.append("files", audioFile);
        uploadPromises.push(
          fetch("/api/upload", { method: "POST", body: uploadFormData })
            .then((res) => res.json())
            .then((result) => ({ type: "audio", urls: result.urls }))
        );
      }

      // Upload notes
      const notesFile = data.get("notesFile") as File;
      if (notesFile && notesFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("type", "sermons");
        uploadFormData.append("files", notesFile);
        uploadPromises.push(
          fetch("/api/upload", { method: "POST", body: uploadFormData })
            .then((res) => res.json())
            .then((result) => ({ type: "notes", urls: result.urls }))
        );
      }

      // Wait for all uploads to complete
      setUploadProgress("Uploading sermon media...");
      const uploadResults = await Promise.all(uploadPromises);

      // Extract URLs from results
      const uploadedUrls: Record<string, string> = {};
      uploadResults.forEach((result) => {
        if (result.urls && result.urls.length > 0) {
          uploadedUrls[result.type] = result.urls[0];
        }
      });

      setUploadProgress(
        `Uploaded ${Object.keys(uploadedUrls).length} file${Object.keys(uploadedUrls).length > 1 ? "s" : ""}`
      );

      const newSermon = {
        title: String(data.get("title") || "Untitled Sermon"),
        date: String(data.get("date") || new Date().toISOString().slice(0, 10)),
        description: String(data.get("description") || ""),
        category:
          (data.get("category") as Sermon["category"]) || "Sunday Service",
        speaker: String(data.get("speaker") || "Team"),
        videoUrl:
          uploadedUrls.video ||
          String(
            data.get("videoUrl") ||
              "https://storage.googleapis.com/coverr-main/mp4%2FMovement.mp4"
          ),
        audioUrl:
          uploadedUrls.audio ||
          String(
            data.get("audioUrl") ||
              "https://r2.example.com/kcf-media/audio/sample.mp3"
          ),
        notesUrl:
          uploadedUrls.notes ||
          (data.get("notesUrl") ? String(data.get("notesUrl")) : undefined),
        thumbnail:
          uploadedUrls.thumbnail ||
          String(
            data.get("thumbnail") ||
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
          ),
      };

      setUploadProgress("Saving sermon...");
      const response = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSermon),
      });

      if (response.ok) {
        const createdSermon = await response.json();
        setSermons((prev) => [createdSermon, ...prev]);
        form.reset();
        toast.success("Sermon created successfully");
        setUploadProgress("");
      } else {
        throw new Error("Failed to create sermon");
      }
    } catch (error) {
      console.error("Error creating sermon:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create sermon"
      );
      setUploadProgress("");
    } finally {
      setSaving(false);
    }
  };

  const handleGallerySubmit = async (form: HTMLFormElement) => {
    setSaving(true);
    setUploadProgress("");
    try {
      const data = new FormData(form);
      const title = data.get("title") ? String(data.get("title")) : undefined;
      const category =
        (data.get("category") as GalleryItem["category"]) || "Events";
      const description = data.get("description")
        ? String(data.get("description"))
        : undefined;

      let imageUrls: string[] = [];

      // Handle file uploads
      const files = data.getAll("files") as File[];
      if (files.length > 0) {
        setUploadProgress("Uploading files to Cloudflare...");
        const uploadFormData = new FormData();
        uploadFormData.append("type", "gallery"); // Specify upload type for correct folder
        files.forEach((file) => {
          if (file.size > 0) {
            // Only add non-empty files
            uploadFormData.append("files", file);
          }
        });

        if (uploadFormData.has("files")) {
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload files");
          }

          const uploadResult = await uploadResponse.json();
          imageUrls = imageUrls.concat(uploadResult.urls);
          setUploadProgress(
            `Uploaded ${uploadResult.count} file${uploadResult.count > 1 ? "s" : ""} successfully`
          );
        }
      }

      // Handle URL inputs
      const imagesText = String(data.get("images") || "").trim();
      if (imagesText) {
        const urlInputs = imagesText
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url.length > 0);
        imageUrls = imageUrls.concat(urlInputs);
      }

      if (imageUrls.length === 0) {
        throw new Error("Please provide either uploaded files or image URLs");
      }

      setUploadProgress("Saving to database...");
      // Create gallery items for each image
      const newItems = imageUrls.map((imageUrl) => ({
        title: title || `Gallery Item ${new Date().toLocaleDateString()}`,
        category,
        image: imageUrl,
        description,
      }));

      const response = await fetch("/api/gallery-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });

      if (response.ok) {
        const createdItems = await response.json();
        setGallery((prev) => [...createdItems, ...prev]);
        form.reset();
        toast.success(
          `${createdItems.length} gallery item${createdItems.length > 1 ? "s" : ""} created successfully`
        );
        setUploadProgress("");
      } else {
        throw new Error("Failed to create gallery items");
      }
    } catch (error) {
      console.error("Error creating gallery items:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create gallery items"
      );
      setUploadProgress("");
    } finally {
      setSaving(false);
    }
  };

  const handleEventEdit = async (event: Event) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/events/${event._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prev) =>
          prev.map((e) => (e._id === event._id ? updatedEvent : e))
        );
        setEditingEvent(null);
        toast.success("Event updated successfully");
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleEventDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        toast.success("Event deleted successfully");
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleSermonEdit = async (sermon: Sermon) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/sermons/${sermon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sermon),
      });

      if (response.ok) {
        const updatedSermon = await response.json();
        setSermons((prev) =>
          prev.map((s) => (s._id === sermon._id ? updatedSermon : s))
        );
        setEditingSermon(null);
        toast.success("Sermon updated successfully");
      } else {
        throw new Error("Failed to update sermon");
      }
    } catch (error) {
      console.error("Error updating sermon:", error);
      toast.error("Failed to update sermon");
    } finally {
      setSaving(false);
    }
  };

  const handleSermonDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return;

    try {
      const response = await fetch(`/api/sermons/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSermons((prev) => prev.filter((s) => s._id !== id));
        toast.success("Sermon deleted successfully");
      } else {
        throw new Error("Failed to delete sermon");
      }
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast.error("Failed to delete sermon");
    }
  };

  const handleGalleryEdit = async (item: GalleryItem) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/gallery-metadata/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setGallery((prev) =>
          prev.map((g) => (g._id === item._id ? updatedItem : g))
        );
        setEditingGallery(null);
        toast.success("Gallery item updated successfully");
      } else {
        throw new Error("Failed to update gallery item");
      }
    } catch (error) {
      console.error("Error updating gallery item:", error);
      toast.error("Failed to update gallery item");
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const response = await fetch(`/api/gallery-metadata/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGallery((prev) => prev.filter((g) => g._id !== id));
        toast.success("Gallery item deleted successfully");
      } else {
        throw new Error("Failed to delete gallery item");
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast.error("Failed to delete gallery item");
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <section className="section-shell">
        <div className="container space-y-10">
          <SectionHeader
            eyebrow="Admin"
            title="Content control center"
            description="Manage events, sermons, and gallery content. All changes are saved to the database."
            align="center"
          />

          <div className="flex justify-end">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "bg-black border-white/10",
                  userButtonPopoverText: "text-white",
                  userButtonPopoverActionButton: "text-white hover:bg-white/10",
                },
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Events" value={counts.events} />
            <StatCard label="Sermons" value={counts.sermons} />
            <StatCard label="Gallery" value={counts.gallery} />
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Save className="h-5 w-5 text-primary" /> Quick publish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events" className="space-y-6">
                <TabsList className="w-full justify-start gap-2 overflow-x-auto">
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="sermons">Sermons</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="space-y-6">
                  <AdminForm
                    onSubmit={handleEventSubmit}
                    fields={[
                      { name: "title", label: "Title", type: "text" },
                      { name: "date", label: "Date", type: "date" },
                      { name: "location", label: "Location", type: "text" },
                      {
                        name: "category",
                        label: "Category",
                        type: "select",
                        options: [
                          "Conference",
                          "Youth",
                          "Prayer",
                          "Retreat",
                          "Sunday",
                        ],
                      },
                      {
                        name: "files",
                        label:
                          "Upload Event Media (images, videos, PDFs - max 50MB each)",
                        type: "file",
                        required: false,
                        accept: "image/*,video/*,audio/*,.pdf",
                        multiple: true,
                      },
                      {
                        name: "image",
                        label: "Or Image URL",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                      },
                    ]}
                    cta="Add event"
                  />
                  <DataTable
                    columns={["Title", "Date", "Category", "Location"]}
                    rows={events.map((e) => [
                      e.title,
                      e.date,
                      e.category,
                      e.location,
                    ])}
                    onEdit={(index) => setEditingEvent(events[index])}
                    onDelete={(index) => handleEventDelete(events[index]._id!)}
                  />
                </TabsContent>

                <TabsContent value="sermons" className="space-y-6">
                  <AdminForm
                    onSubmit={handleSermonSubmit}
                    fields={[
                      { name: "title", label: "Title", type: "text" },
                      { name: "date", label: "Date", type: "date" },
                      { name: "speaker", label: "Speaker", type: "text" },
                      {
                        name: "category",
                        label: "Category",
                        type: "select",
                        options: [
                          "Sunday Service",
                          "Youth Service",
                          "Conferences",
                          "Special Sermons",
                        ],
                      },
                      {
                        name: "thumbnailFile",
                        label: "Upload Thumbnail (image)",
                        type: "file",
                        required: false,
                        accept: "image/*",
                        multiple: false,
                      },
                      {
                        name: "videoFile",
                        label: "Upload Video (max 100MB)",
                        type: "file",
                        required: false,
                        accept: "video/*",
                        multiple: false,
                      },
                      {
                        name: "audioFile",
                        label: "Upload Audio (max 100MB)",
                        type: "file",
                        required: false,
                        accept: "audio/*",
                        multiple: false,
                      },
                      {
                        name: "notesFile",
                        label: "Upload Notes (PDF)",
                        type: "file",
                        required: false,
                        accept: ".pdf",
                        multiple: false,
                      },
                      {
                        name: "thumbnail",
                        label: "Or Thumbnail URL",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "videoUrl",
                        label: "Or Video URL",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "audioUrl",
                        label: "Or Audio URL",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "notesUrl",
                        label: "Or Notes URL (optional)",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                      },
                    ]}
                    cta="Add sermon"
                  />
                  <DataTable
                    columns={["Title", "Date", "Category", "Speaker"]}
                    rows={sermons.map((s) => [
                      s.title,
                      s.date,
                      s.category,
                      s.speaker,
                    ])}
                    onEdit={(index) => setEditingSermon(sermons[index])}
                    onDelete={(index) =>
                      handleSermonDelete(sermons[index]._id!)
                    }
                  />
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <AdminForm
                    onSubmit={handleGallerySubmit}
                    fields={[
                      {
                        name: "title",
                        label: "Title (optional)",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "category",
                        label: "Category",
                        type: "select",
                        options: [
                          "Events",
                          "Fellowship",
                          "Leaders",
                          "Conferences",
                        ],
                      },
                      {
                        name: "files",
                        label:
                          "Upload Images from Computer (multiple files allowed, max 10MB each)",
                        type: "file",
                        required: false,
                        accept: "image/*",
                        multiple: true,
                      },
                      {
                        name: "images",
                        label: "Or paste Image URLs (one per line)",
                        type: "textarea",
                        required: false,
                        placeholder:
                          "https://example.com/image1.jpg\nhttps://example.com/image2.jpg",
                      },
                      {
                        name: "description",
                        label: "Caption (optional)",
                        type: "textarea",
                        required: false,
                      },
                    ]}
                    cta="Add gallery items"
                  />
                  {uploadProgress && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploadProgress}
                    </div>
                  )}
                  <DataTable
                    columns={["Title", "Category", "Image"]}
                    rows={gallery.map((g) => [
                      g.title || "No title",
                      g.category,
                      g.image,
                    ])}
                    onEdit={(index) => setEditingGallery(gallery[index])}
                    onDelete={(index) =>
                      handleGalleryDelete(gallery[index]._id!)
                    }
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Edit Forms */}
          {editingEvent && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Edit className="h-5 w-5 text-primary" /> Edit Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditEventForm
                  event={editingEvent}
                  onSave={handleEventEdit}
                  onCancel={() => setEditingEvent(null)}
                  saving={saving}
                />
              </CardContent>
            </Card>
          )}

          {editingSermon && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Edit className="h-5 w-5 text-primary" /> Edit Sermon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditSermonForm
                  sermon={editingSermon}
                  onSave={handleSermonEdit}
                  onCancel={() => setEditingSermon(null)}
                  saving={saving}
                />
              </CardContent>
            </Card>
          )}

          {editingGallery && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Edit className="h-5 w-5 text-primary" /> Edit Gallery Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditGalleryForm
                  item={editingGallery}
                  onSave={handleGalleryEdit}
                  onCancel={() => setEditingGallery(null)}
                  saving={saving}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card">
      <p className="text-xs uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-foreground">{value}</span>
        <Badge variant="subtle">database</Badge>
      </div>
    </div>
  );
}

type Field =
  | {
      name: string;
      label: string;
      type: "text" | "date";
      required?: boolean;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      required?: boolean;
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "file";
      required?: boolean;
      accept?: string;
      multiple?: boolean;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
    };

function AdminForm({
  onSubmit,
  fields,
  cta,
}: {
  onSubmit: (form: HTMLFormElement) => void;
  fields: Field[];
  cta: string;
}) {
  return (
    <form
      className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "textarea") {
            return (
              <div key={field.name} className="md:col-span-2 space-y-2">
                <label
                  className="text-sm text-foreground/80"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder || field.label}
                  required={field.required !== false}
                />
              </div>
            );
          }
          if (field.type === "file") {
            return (
              <div key={field.name} className="md:col-span-2 space-y-2">
                <label
                  className="text-sm text-foreground/80"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="file"
                  accept={field.accept}
                  multiple={field.multiple}
                  required={field.required !== false}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground file:hover:bg-primary/90"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (file.size > 10 * 1024 * 1024) {
                          alert(
                            `File "${file.name}" is too large. Maximum size is 10MB.`
                          );
                          e.target.value = "";
                          return;
                        }
                        if (!file.type.startsWith("image/")) {
                          alert(
                            `File "${file.name}" is not an image. Please select image files only.`
                          );
                          e.target.value = "";
                          return;
                        }
                      }
                    }
                  }}
                />
              </div>
            );
          }
          if (field.type === "select") {
            return (
              <div key={field.name} className="space-y-2">
                <label
                  className="text-sm text-foreground/80"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required={field.required !== false}
                >
                  {field.options.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-background text-foreground"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          return (
            <div key={field.name} className="space-y-2">
              <label
                className="text-sm text-foreground/80"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder || field.label}
                required={field.required !== false}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="secondary"
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> {cta}
        </Button>
      </div>
    </form>
  );
}

function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
}: {
  columns: string[];
  rows: (string | number)[][];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="text-foreground/70">
                {col}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className="text-foreground/70">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((cells, idx) => (
            <TableRow key={idx}>
              {cells.map((cell, i) => (
                <TableCell key={i} className="text-sm text-foreground/80">
                  {cell}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(idx)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(idx)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EditEventForm({
  event,
  onSave,
  onCancel,
  saving,
}: {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedEvent: Event = {
      ...event,
      title: String(formData.get("title") || event.title),
      date: String(formData.get("date") || event.date),
      location: String(formData.get("location") || event.location),
      description: String(formData.get("description") || event.description),
      image: String(formData.get("image") || event.image),
      category:
        (formData.get("category") as Event["category"]) || event.category,
    };
    onSave(updatedEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input name="title" defaultValue={event.title} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input name="date" type="date" defaultValue={event.date} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Input name="location" defaultValue={event.location} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            defaultValue={event.category}
            className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm"
            required
          >
            <option value="Conference">Conference</option>
            <option value="Youth">Youth</option>
            <option value="Prayer">Prayer</option>
            <option value="Retreat">Retreat</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input name="image" defaultValue={event.image} required />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            defaultValue={event.description}
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditSermonForm({
  sermon,
  onSave,
  onCancel,
  saving,
}: {
  sermon: Sermon;
  onSave: (sermon: Sermon) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSermon: Sermon = {
      ...sermon,
      title: String(formData.get("title") || sermon.title),
      date: String(formData.get("date") || sermon.date),
      speaker: String(formData.get("speaker") || sermon.speaker),
      description: String(formData.get("description") || sermon.description),
      category:
        (formData.get("category") as Sermon["category"]) || sermon.category,
      thumbnail: String(formData.get("thumbnail") || sermon.thumbnail),
      videoUrl: String(formData.get("videoUrl") || sermon.videoUrl),
      audioUrl: String(formData.get("audioUrl") || sermon.audioUrl),
      notesUrl: formData.get("notesUrl")
        ? String(formData.get("notesUrl"))
        : sermon.notesUrl,
    };
    onSave(updatedSermon);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input name="title" defaultValue={sermon.title} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <Input name="date" type="date" defaultValue={sermon.date} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Speaker</label>
          <Input name="speaker" defaultValue={sermon.speaker} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            defaultValue={sermon.category}
            className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm"
            required
          >
            <option value="Sunday Service">Sunday Service</option>
            <option value="Youth Service">Youth Service</option>
            <option value="Conferences">Conferences</option>
            <option value="Special Sermons">Special Sermons</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Thumbnail URL
          </label>
          <Input name="thumbnail" defaultValue={sermon.thumbnail} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <Input name="videoUrl" defaultValue={sermon.videoUrl} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Audio URL</label>
          <Input name="audioUrl" defaultValue={sermon.audioUrl} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes URL (optional)
          </label>
          <Input name="notesUrl" defaultValue={sermon.notesUrl || ""} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            defaultValue={sermon.description}
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditGalleryForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: GalleryItem;
  onSave: (item: GalleryItem) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedItem: GalleryItem = {
      ...item,
      title: formData.get("title") ? String(formData.get("title")) : item.title,
      category:
        (formData.get("category") as GalleryItem["category"]) || item.category,
      image: String(formData.get("image") || item.image),
      description: formData.get("description")
        ? String(formData.get("description"))
        : undefined,
    };
    onSave(updatedItem);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">
            Title (optional)
          </label>
          <Input name="title" defaultValue={item.title} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            defaultValue={item.category}
            className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm"
            required
          >
            <option value="Events">Events</option>
            <option value="Fellowship">Fellowship</option>
            <option value="Leaders">Leaders</option>
            <option value="Conferences">Conferences</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input name="image" defaultValue={item.image} required />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Caption (optional)
          </label>
          <Textarea name="description" defaultValue={item.description || ""} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
