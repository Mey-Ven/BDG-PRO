"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { usePartnerForm } from "./partner-form-context"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Form schema
const formSchema = z.object({
  // Company information
  companyName: z.string().min(2, { message: "Le nom de l'entreprise doit contenir au moins 2 caractères" }),
  contactName: z.string().min(2, { message: "Le nom du contact doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }).min(1, { message: "L'email est requis pour l'envoi" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  postalCode: z.string().regex(/^[0-9]{5}$/, { message: "Code postal invalide (5 chiffres)" }),
  city: z.string().min(2, { message: "La ville doit contenir au moins 2 caractères" }),
  message: z.string().min(10, { message: "Veuillez décrire votre entreprise et vos attentes (minimum 10 caractères)" }),
})

type FormValues = z.infer<typeof formSchema>

export default function PartnerForm() {
  const { isOpen, closeForm } = usePartnerForm()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      message: "",
    },
    mode: "onChange"
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/send-partner-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerInfo: data,
          subject: `[PARTENARIAT] ${data.companyName} - Nouvelle demande`
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.");
        form.reset();
        closeForm();
      } else {
        toast.error("Une erreur s'est produite lors de l'envoi du formulaire.");
        console.error("Error:", result.message);
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'envoi du formulaire.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" style={{ display: isOpen ? "flex" : "none" }}>
      <Card className="w-full max-w-3xl mx-auto overflow-auto max-h-[90vh]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Devenir Partenaire
          </CardTitle>
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={closeForm}
          >
            X
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Informations de l'entreprise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom et prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="06 12 34 56 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre entreprise et vos attentes concernant ce partenariat (obligatoire)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                  <Button type="submit">Envoyer</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
