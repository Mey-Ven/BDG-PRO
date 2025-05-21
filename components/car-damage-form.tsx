"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { toast } from "sonner"
import { useCarDamageForm } from "./car-damage-form-context"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InsuranceSelector } from "@/components/insurance-selector"

// Validation des plaques d'immatriculation françaises
const licensePlateRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;

// Validation du code postal français
const postalCodeRegex = /^[0-9]{5}$/;

// Form schema
const formSchema = z.object({
  // Basic client information
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }).min(1, { message: "L'email est requis pour l'envoi" }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }),

  // Car information
  licensePlate: z.string()
    .regex(licensePlateRegex, { message: "Format invalide. Exemple: AB-123-CD" })
    .toUpperCase(),
  insurance: z.string().min(1, { message: "Veuillez sélectionner votre assurance" }),
  customInsurance: z.string().optional(),

  // Address information
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  postalCode: z.string().regex(postalCodeRegex, { message: "Code postal invalide" }),
  city: z.string().min(2, { message: "La ville doit contenir au moins 2 caractères" }),

  // Car glass selection
  glassType: z.enum(["windshield", "leftSide", "rightSide", "rearWindow", "other"], {
    required_error: "Veuillez sélectionner un type de vitre",
  }),

  // Conditional fields
  // For windshield
  damageType: z.enum(["singleCrack", "singleImpact", "multipleImpacts", "manyImpacts"]).optional(),

  // For side windows
  positionVitre: z.enum(["front", "rear"]).optional(), // Renamed from windowPosition
  typeVitre: z.enum(["slidingDoor", "fixedDoor", "fixedBody"]).optional(), // Renamed from windowType

  // For rear window
  rearWindowType: z.enum(["complete", "leftSide", "rightSide"]).optional(),

  // For other glass types
  otherDescription: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CarDamageForm() {
  const [step, setStep] = useState(1)
  const { isOpen, closeForm, referralCode } = useCarDamageForm()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licensePlate: "",
      insurance: "",
      customInsurance: "",
      address: "",
      postalCode: "",
      city: "",
    },
    mode: "onChange" // Validation à chaque changement pour une meilleure expérience utilisateur
  })

  const { watch, formState } = form
  const glassType = watch("glassType")

  // Fonctions de validation pour chaque étape
  const isStep1Valid = () => {
    const { firstName, lastName, email, phone, licensePlate, insurance, customInsurance, address, postalCode, city } = form.getValues()
    return (
      firstName.length >= 2 &&
      lastName.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      phone.length >= 8 &&
      licensePlateRegex.test(licensePlate) &&
      insurance.length > 0 &&
      (insurance !== "autre" || (customInsurance && customInsurance.length >= 2)) &&
      address.length >= 5 &&
      postalCodeRegex.test(postalCode) &&
      city.length >= 2
    )
  }

  const isStep2Valid = () => {
    return !!glassType
  }

  const isStep3Valid = () => {
    if (glassType === "windshield") {
      return !!watch("damageType")
    } else if (glassType === "leftSide" || glassType === "rightSide") {
      return !!watch("positionVitre")
    } else if (glassType === "rearWindow") {
      return !!watch("rearWindowType")
    } else if (glassType === "other") {
      return (watch("otherDescription") || "").length > 0
    }
    return false
  }

  const isStep4Valid = () => {
    if (glassType === "leftSide" || glassType === "rightSide") {
      return !!watch("typeVitre")
    }
    return true
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Envoi en cours...");

      // Format the email data
      // L'email du client (data.email) sera utilisé comme expéditeur du message
      const emailData = {
        to: process.env.EMAIL_TO || "destination@example.com",
        subject: "Nouveau signalement de dommage de vitre",
        clientInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email, // Cet email sera utilisé comme expéditeur
          phone: data.phone,
          licensePlate: data.licensePlate,
          insurance: data.insurance === "autre" ? `${data.insurance} (${data.customInsurance})` : data.insurance,
          address: data.address,
          postalCode: data.postalCode,
          city: data.city
        },
        glassType: {
          type: data.glassType,
          label: getGlassTypeLabel(data.glassType)
        },
        details: {},
        referralCode: referralCode // Ajouter le code de référence s'il existe
      };

      // Add conditional fields based on glass type
      if (data.glassType === "windshield" && data.damageType) {
        emailData.details = {
          damageType: {
            type: data.damageType,
            label: getDamageTypeLabel(data.damageType)
          }
        };
      } else if ((data.glassType === "leftSide" || data.glassType === "rightSide") && data.positionVitre && data.typeVitre) {
        emailData.details = {
          positionVitre: {
            type: data.positionVitre,
            label: getWindowPositionLabel(data.positionVitre)
          },
          typeVitre: {
            type: data.typeVitre,
            label: getWindowTypeLabel(data.typeVitre)
          }
        };
      } else if (data.glassType === "rearWindow" && data.rearWindowType) {
        emailData.details = {
          rearWindowType: {
            type: data.rearWindowType,
            label: getRearWindowTypeLabel(data.rearWindowType)
          }
        };
      } else if (data.glassType === "other" && data.otherDescription) {
        emailData.details = {
          "Description détaillée": data.otherDescription
        };
      }

      try {
        // Send data to the API route
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Dismiss loading toast
        toast.dismiss(loadingToast);

        if (result.success) {
          // Email envoyé avec succès via Nodemailer
          toast.success("Votre demande a été envoyée avec succès! Nous vous répondrons directement à votre adresse email.");

          // Reset form and close
          form.reset();
          setStep(1);
          closeForm();
        } else if (result.mailtoUrl) {
          // Si l'envoi via Nodemailer échoue mais nous avons un fallback mailto
          toast.warning("Envoi automatique impossible. Ouverture de votre client email...");

          // Wait a moment before opening the email client
          setTimeout(() => {
            window.open(result.mailtoUrl);
          }, 1500);

          // Reset form and close
          form.reset();
          setStep(1);
          closeForm();
        } else {
          throw new Error("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        toast.dismiss(loadingToast);

        // Message d'erreur plus détaillé
        const errorMessage = apiError instanceof Error ? apiError.message : "Erreur inconnue";
        toast.error(`Erreur lors de l'envoi: ${errorMessage}. Tentative de solution alternative...`);

        // Direct fallback to mailto if Nodemailer fails completely
        try {
          const emailSubject = "Nouveau signalement de dommage de vitre";
          const emailBody = `
Nouveau signalement de dommage de vitre

Informations client:
Prénom: ${data.firstName}
Nom: ${data.lastName}
Email: ${data.email}
Téléphone: ${data.phone}
Plaque d'immatriculation: ${data.licensePlate}
Assurance: ${data.insurance === "autre" ? `${data.insurance} (${data.customInsurance})` : data.insurance}
Adresse: ${data.address}, ${data.postalCode} ${data.city}

Type de vitre: ${getGlassTypeLabel(data.glassType)}
${data.glassType === "windshield" && data.damageType ? `Type de dommage: ${getDamageTypeLabel(data.damageType)}` : ''}
${(data.glassType === "leftSide" || data.glassType === "rightSide") && data.positionVitre ? `Position: ${getWindowPositionLabel(data.positionVitre)}` : ''}
${(data.glassType === "leftSide" || data.glassType === "rightSide") && data.typeVitre ? `Type de vitre: ${getWindowTypeLabel(data.typeVitre)}` : ''}
${data.glassType === "rearWindow" && data.rearWindowType ? `Type de lunette arrière: ${getRearWindowTypeLabel(data.rearWindowType)}` : ''}
${data.glassType === "other" && data.otherDescription ? `Description détaillée: ${data.otherDescription}` : ''}
          `;

          toast.warning("Tentative d'envoi par email direct via votre client email...");

          setTimeout(() => {
            const mailtoLink = `mailto:${process.env.EMAIL_TO || "destination@example.com"}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoLink);
          }, 1500);

          // Reset form and close even if we had to use mailto
          form.reset();
          setStep(1);
          closeForm();
        } catch (mailtoError) {
          console.error("Mailto fallback error:", mailtoError);
          toast.error(`Impossible d'envoyer votre demande. Veuillez nous contacter directement au ${process.env.NEXT_PUBLIC_CONTACT_PHONE?.replace("+33", "0") || "01 23 45 67 89"}.`);
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Form submission error:", error);
    }
  }

  // Helper functions to get human-readable labels
  const getGlassTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      windshield: "Pare-brise",
      leftSide: "Vitre latérale gauche",
      rightSide: "Vitre latérale droite",
      rearWindow: "Lunette arrière",
      other: "Autres vitres"
    }
    return labels[type] || type
  }

  const getDamageTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      singleCrack: "1 Fissure",
      singleImpact: "1 Impact",
      multipleImpacts: "2-3 Impacts",
      manyImpacts: "4 Impacts et plus"
    }
    return labels[type] || type
  }

  const getWindowPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
      front: "Vitres avant",
      rear: "Vitres arrière"
    }
    return labels[position] || position
  }

  const getWindowTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      slidingDoor: "Vitre descendante sur la portière",
      fixedDoor: "Vitre fixe sur la portière",
      fixedBody: "Vitre fixe sur la carrosserie"
    }
    return labels[type] || type
  }

  const getRearWindowTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      complete: "Lunette arrière complète",
      leftSide: "Arrière gauche côté conducteur",
      rightSide: "Arrière droite côté passager"
    }
    return labels[type] || type
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" style={{ display: isOpen ? "flex" : "none" }}>
      <Card className="w-full max-w-3xl mx-auto overflow-auto max-h-[90vh]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Signaler un dommage de vitre
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
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Informations personnelles</h2>
                  <p className="text-sm text-muted-foreground mb-4">Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel><span className="text-red-500">*</span> Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Jean" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel><span className="text-red-500">*</span> Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Dupont" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Email (sera utilisé comme expéditeur)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Cet email sera utilisé comme adresse d'expéditeur pour que nous puissions vous répondre directement.
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Téléphone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Plaque d'immatriculation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="AB-123-CD"
                            {...field}
                            onChange={(e) => {
                              // Convertir en majuscules et formater automatiquement
                              const value = e.target.value.toUpperCase();
                              if (value.length <= 9) {
                                let formatted = value;
                                // Ajouter automatiquement les tirets
                                if (value.length > 2 && !value.includes('-')) {
                                  formatted = value.slice(0, 2) + '-' + value.slice(2);
                                }
                                if (value.length > 6 && formatted.indexOf('-', 3) === -1) {
                                  formatted = formatted.slice(0, 6) + '-' + formatted.slice(6);
                                }
                                field.onChange(formatted);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Assurance</FormLabel>
                        <FormControl>
                          <InsuranceSelector
                            value={field.value}
                            onChange={field.onChange}
                            customInsurance={form.watch("customInsurance")}
                            onCustomInsuranceChange={(value) => form.setValue("customInsurance", value, { shouldValidate: true })}
                          />
                        </FormControl>
                        <FormMessage />
                        {field.value === "autre" && (
                          <FormField
                            control={form.control}
                            name="customInsurance"
                            render={({ field: customField }) => (
                              <FormItem className="mt-2">
                                <FormLabel><span className="text-red-500">*</span> Nom de votre assurance</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Saisissez le nom de votre assurance"
                                    {...customField}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </FormItem>
                    )}
                  />

                  <h3 className="text-lg font-medium mt-4">Adresse</h3>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Rue et numéro</FormLabel>
                        <FormControl>
                          <Input placeholder="123 rue de Paris" {...field} />
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
                          <FormLabel><span className="text-red-500">*</span> Code postal</FormLabel>
                          <FormControl>
                            <Input placeholder="75001" {...field} />
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
                          <FormLabel><span className="text-red-500">*</span> Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                    </div>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep1Valid()}
                      title={!isStep1Valid() ? "Veuillez remplir tous les champs obligatoires" : ""}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Sélection de la vitre endommagée</h2>
                  <FormField
                    control={form.control}
                    name="glassType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel><span className="text-red-500">*</span> Quelle vitre est endommagée?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "windshield"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("windshield")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="windshield" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/car-front-active.svg"
                                    alt="Pare-brise"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "windshield" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "windshield" ? "text-primary" : ""}`}>
                                  Pare-brise
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "leftSide"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("leftSide")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="leftSide" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/car-left-active.svg"
                                    alt="Vitre latérale gauche"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "leftSide" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "leftSide" ? "text-primary" : ""}`}>
                                  Vitre latérale gauche
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "rightSide"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("rightSide")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="rightSide" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/car-right-active.svg"
                                    alt="Vitre latérale droite"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "rightSide" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "rightSide" ? "text-primary" : ""}`}>
                                  Vitre latérale droite
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "rearWindow"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("rearWindow")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="rearWindow" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/car-rear-active.svg"
                                    alt="Lunette arrière"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "rearWindow" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "rearWindow" ? "text-primary" : ""}`}>
                                  Lunette arrière
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 md:col-span-2 ${
                                field.value === "other"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("other")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="other" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/car-empty.svg"
                                    alt="Autres"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "other" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 text-center ${field.value === "other" ? "text-primary" : ""}`}>
                                  Autres (vitres multiples ou toit panoramique)
                                </FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep2Valid()}
                      title={!isStep2Valid() ? "Veuillez sélectionner un type de vitre" : ""}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && glassType === "windshield" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Type de dommage sur le pare-brise</h2>
                  <FormField
                    control={form.control}
                    name="damageType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel><span className="text-red-500">*</span> Sélectionnez le type de dommage</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "singleCrack"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("singleCrack")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="singleCrack" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/1 fissure.png"
                                    alt="1 Fissure"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "singleCrack" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "singleCrack" ? "text-primary" : ""}`}>
                                  1 Fissure
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "singleImpact"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("singleImpact")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="singleImpact" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/1 impact.png"
                                    alt="1 Impact"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "singleImpact" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "singleImpact" ? "text-primary" : ""}`}>
                                  1 Impact
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "multipleImpacts"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("multipleImpacts")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="multipleImpacts" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/2-3 impacts.png"
                                    alt="2-3 Impacts"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "multipleImpacts" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "multipleImpacts" ? "text-primary" : ""}`}>
                                  2-3 Impacts
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "manyImpacts"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("manyImpacts")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="manyImpacts" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/4 Impacts et plus.png"
                                    alt="4 Impacts et plus"
                                    width={100}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "manyImpacts" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "manyImpacts" ? "text-primary" : ""}`}>
                                  4 Impacts et plus
                                </FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={!isStep3Valid()}
                      title={!isStep3Valid() ? "Veuillez sélectionner un type de dommage" : ""}
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (glassType === "leftSide" || glassType === "rightSide") && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Position de la vitre latérale</h2>
                  <FormField
                    control={form.control}
                    name="positionVitre"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel><span className="text-red-500">*</span> Sélectionnez la position</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "front"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("front")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="front" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/Vitres-avant.png"
                                    alt="Vitres avant"
                                    width={150}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "front" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "front" ? "text-primary" : ""}`}>
                                  Vitres avant
                                </FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className={`flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer transition-all duration-200 ${
                                field.value === "rear"
                                  ? "bg-primary/10 border-primary shadow-md"
                                  : "hover:bg-muted/50 border-border"
                              }`}
                              onClick={() => field.onChange("rear")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="rear" className="sr-only" />
                                </FormControl>
                                <div className="relative flex items-center justify-center w-full h-24">
                                  <Image
                                    src="/images/Vitres-arriere.png"
                                    alt="Vitres arrière"
                                    width={150}
                                    height={100}
                                    className="object-contain max-h-full max-w-full"
                                  />
                                  {field.value === "rear" && (
                                    <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
                                  )}
                                </div>
                                <FormLabel className={`font-medium mt-2 ${field.value === "rear" ? "text-primary" : ""}`}>
                                  Vitres arrière
                                </FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep3Valid()}
                      title={!isStep3Valid() ? "Veuillez sélectionner la position de la vitre" : ""}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (glassType === "leftSide" || glassType === "rightSide") && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Type de vitre latérale</h2>
                  <FormField
                    control={form.control}
                    name="typeVitre"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel><span className="text-red-500">*</span> Sélectionnez le type de vitre</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4"
                          >
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("slidingDoor")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="slidingDoor" className="sr-only" />
                                </FormControl>
                                <Image
                                  src={form.watch("positionVitre") === "front"
                                    ? "/images/Vitre descendante sur la portière avant.png"
                                    : "/images/Vitre descendante sur la portière arriere.png"}
                                  alt="Vitre descendante sur la portière"
                                  width={150}
                                  height={100}
                                  className={`object-contain h-24 w-auto ${field.value === "slidingDoor" ? "border-4 border-primary" : ""}`}
                                />
                                <FormLabel className="font-normal">Vitre descendante sur la portière</FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("fixedDoor")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="fixedDoor" className="sr-only" />
                                </FormControl>
                                <Image
                                  src={form.watch("positionVitre") === "front"
                                    ? "/images/Vitre fixe sur la portière avant.png"
                                    : "/images/Vitre fixe sur la portière arriere.png"}
                                  alt="Vitre fixe sur la portière"
                                  width={150}
                                  height={100}
                                  className={`object-contain h-24 w-auto ${field.value === "fixedDoor" ? "border-4 border-primary" : ""}`}
                                />
                                <FormLabel className="font-normal">Vitre fixe sur la portière</FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("fixedBody")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="fixedBody" className="sr-only" />
                                </FormControl>
                                <Image
                                  src={form.watch("positionVitre") === "front"
                                    ? "/images/Vitre fixe sur la carrosserie avant.png"
                                    : "/images/Vitre fixe sur la carrosserie arriere.png"}
                                  alt="Vitre fixe sur la carrosserie"
                                  width={150}
                                  height={100}
                                  className={`object-contain h-24 w-auto ${field.value === "fixedBody" ? "border-4 border-primary" : ""}`}
                                />
                                <FormLabel className="font-normal">Vitre fixe sur la carrosserie</FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={!isStep4Valid()}
                      title={!isStep4Valid() ? "Veuillez sélectionner le type de vitre" : ""}
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && glassType === "rearWindow" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Type de lunette arrière</h2>
                  <FormField
                    control={form.control}
                    name="rearWindowType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel><span className="text-red-500">*</span> Précisez quelle lunette arrière</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-4"
                          >
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("complete")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="complete" className="sr-only" />
                                </FormControl>
                                <Image
                                  src="/images/car-rear-active.svg"
                                  alt="Lunette arrière complète"
                                  width={150}
                                  height={100}
                                  className={`object-contain h-24 w-auto ${field.value === "complete" ? "border-4 border-primary" : ""}`}
                                />
                                <FormLabel className="font-normal">Lunette arrière complète</FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("leftSide")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="leftSide" className="sr-only" />
                                </FormControl>
                                <div className="relative">
                                  <Image
                                    src="/images/car-rear-active.svg"
                                    alt="Arrière gauche côté conducteur"
                                    width={150}
                                    height={100}
                                    className={`object-contain h-24 w-auto ${field.value === "leftSide" ? "border-4 border-primary" : ""}`}
                                  />
                                  <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/30"></div>
                                </div>
                                <FormLabel className="font-normal">Arrière gauche côté conducteur</FormLabel>
                              </FormItem>
                            </div>
                            <div
                              className="flex flex-col items-center space-y-2 rounded-md border p-4 cursor-pointer hover:bg-muted"
                              onClick={() => field.onChange("rightSide")}
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="rightSide" className="sr-only" />
                                </FormControl>
                                <div className="relative">
                                  <Image
                                    src="/images/car-rear-active.svg"
                                    alt="Arrière droite côté passager"
                                    width={150}
                                    height={100}
                                    className={`object-contain h-24 w-auto ${field.value === "rightSide" ? "border-4 border-primary" : ""}`}
                                  />
                                  <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/30"></div>
                                </div>
                                <FormLabel className="font-normal">Arrière droite côté passager</FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={!isStep3Valid()}
                      title={!isStep3Valid() ? "Veuillez sélectionner le type de lunette arrière" : ""}
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && glassType === "other" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Autres vitres</h2>
                  <FormField
                    control={form.control}
                    name="otherDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><span className="text-red-500">*</span> Veuillez préciser les détails du dommage:</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder="Décrivez les vitres endommagées (ex: toit panoramique, plusieurs vitres, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={closeForm}>Annuler</Button>
                      <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={!isStep3Valid()}
                      title={!isStep3Valid() ? "Veuillez décrire les vitres endommagées" : ""}
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* We don't need this button anymore as we'll use the "Devenir Partenaire" buttons */}
    </div>
  )
}
