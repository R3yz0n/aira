"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventCreateSchema } from "@/domain/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ICategoryEntity } from "@/domain/category";
import type { IEventEntity } from "@/domain/event";

interface EventCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (formData: FormData) => Promise<IEventEntity>;
  categories: ICategoryEntity[];
  isLoading?: boolean;
}

type FormValues = {
  title: string;
  description: string;
  categoryId: string;
  file: File | null;
};

export function EventCreateDialog({ open, onClose, onCreate, categories }: EventCreateDialogProps) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  const createFormSchema = eventCreateSchema.extend({
    file: z.preprocess(
      (v) => {
        // normalize FileList, File[], or File to a single File-like object or null
        if (v == null) return null;
        if (typeof (v as any)?.item === "function") return (v as FileList).item(0) ?? null;
        if (Array.isArray(v)) return v[0] ?? null;
        if (v instanceof File) return v;
        return v;
      },
      z.any().superRefine((val, ctx) => {
        const file = val as any;
        if (file == null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File is required" });
          return;
        }

        if (
          typeof file.name !== "string" ||
          typeof file.size !== "number" ||
          typeof file.type !== "string"
        ) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid file" });
          return;
        }

        if (!allowedTypes.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG",
          });
        }

        if (file.size > 10 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "File size too large. Maximum 10MB allowed",
          });
        }
      }),
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: { title: "", description: "", categoryId: "", file: null },
    mode: "onSubmit",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    reset({ title: "", description: "", categoryId: "", file: null });
  }, [open, reset]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      // revoke previous
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
      prevUrlRef.current = url;
      setPreviewUrl(url);
      try {
        // store actual File (not FileList) so zod sees a file-like object
        setValue("file", files[0]);
        try {
          clearErrors("file");
        } catch (_) {}
        try {
          trigger("file");
        } catch (_) {}
      } catch (_) {}
    } else {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      setPreviewUrl(null);
      try {
        setValue("file", null);
        try {
          clearErrors("file");
        } catch (_) {}
        try {
          trigger("file");
        } catch (_) {}
      } catch (_) {}
    }
  };

  const handleRemoveFile = () => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    try {
      setValue("file", null);
      try {
        clearErrors("file");
      } catch (_) {}
      try {
        trigger("file");
      } catch (_) {}
    } catch (_) {}
  };

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
    };
  }, []);

  const handleSubmitForm = async (values: FormValues) => {
    const fd = new FormData();
    fd.append("title", values.title ?? "");
    fd.append("description", values.description ?? "");
    fd.append("categoryId", values.categoryId ?? "");
    if (values.file) {
      fd.append("file", values.file);
    }

    await onCreate(fd);
    reset();
    setPreviewUrl(null);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      setPreviewUrl(null);
    }
  }, [open]);

  const fileRegister = register("file", { onChange: handleFileChange });
  const { ref: fileRef, ...fileRegisterProps } = fileRegister as any;

  return (
    <Dialog open={open} onOpenChange={(val) => (!val ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>Create a new event and upload an image.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Title</Label>
            <Input id="event-title" placeholder="Event title" {...register("title")} />
            {errors?.title && (
              <p className="text-sm text-red-600">{(errors.title as any).message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              rows={4}
              placeholder="Describe the event"
              {...register("description")}
            />
            {errors?.description && (
              <p className="text-sm text-red-600">{(errors.description as any).message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-category">Category</Label>
            <select
              id="event-category"
              className="input border ml-2 rounded-md bg-primary/5 px-1"
              {...register("categoryId")}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors?.categoryId && (
              <p className="text-sm text-red-600">{(errors.categoryId as any).message}</p>
            )}
          </div>

          <div className="space-y-2">
            {!previewUrl ? (
              <input
                id="event-file"
                type="file"
                accept="image/*"
                {...fileRegisterProps}
                ref={(e) => {
                  if (fileRef) fileRef(e);
                  fileInputRef.current = e;
                }}
              />
            ) : (
              <div>
                <div className="mb-2">
                  <Button type="button" variant="destructive" onClick={handleRemoveFile}>
                    Remove
                  </Button>
                </div>
                <div>
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded border" />
                </div>
              </div>
            )}
            {errors?.file && (
              <p className="text-sm text-red-600 mt-2">{(errors.file as any).message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="md:inline-flex hidden"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-aira-blue text-white hover:bg-aira-blue/90"
              disabled={isSubmitting}
            >
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EventCreateDialog;
