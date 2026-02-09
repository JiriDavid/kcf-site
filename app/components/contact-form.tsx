"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import emailjs from "@emailjs/browser";

interface FormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setSubmitted(true);
      setError(null);
      reset();
      setTimeout(() => setSubmitted(false), 3500);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("EmailJS error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-white">Name</label>
          <Input
            placeholder="Your full name"
            {...register("name", { required: true })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: true })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm text-white ">Phone / WhatsApp</label>
          <Input
            placeholder="Reach us quickly"
            {...register("phone", { required: false })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white">Message</label>
        <Textarea
          placeholder="Share how we can serve you"
          {...register("message", { required: true })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary">
          Send message
        </Button>
        {submitted ? (
          <p className="text-sm text-primary">
            Message sent successfully! We will reply soon.
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </form>
  );
}
