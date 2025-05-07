// app/recruiter/company/setup/page.tsx
"use client"

import { useEffect, useState } from "react" // Added useEffect
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Building, Globe, Map, Share2, Briefcase } from "lucide-react"

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  logo: z.string().url("Please enter a valid logo URL").or(z.string().length(0)),
  industry: z.string().min(2, "Please select an industry"),
  size: z.enum(["small", "medium", "large", "enterprise"]),
  founded: z.string().min(4, "Please enter a valid year"),
  headquarters: z.string().min(2, "Headquarters location is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required")
  }),
  socialMedia: z.object({
    linkedin: z.string().url("Please enter a valid LinkedIn URL").or(z.string().length(0)).optional(),
    facebook: z.string().url("Please enter a valid Facebook URL").or(z.string().length(0)).optional()
  }).optional()
})

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "hospitality", label: "Hospitality" },
  { value: "construction", label: "Construction" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "legal", label: "Legal Services" },
  { value: "consulting", label: "Consulting" },
  { value: "transportation", label: "Transportation & Logistics" },
  { value: "other", label: "Other" }
]

export default function CompanySetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true); // To track initial data fetch
  const [isEditMode, setIsEditMode] = useState(false); // To track if updating existing company
  const [expandedSection, setExpandedSection] = useState("basic-info")
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    "basic-info": false,
    "company-details": false,
    "about-company": false,
    "location": false,
    "social-media": false
  })
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [previewLogo, setPreviewLogo] = useState("")

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      website: "",
      industry: "",
      logo: "",
      size: "small",
      founded: "",
      headquarters: "",
      description: "",
      location: {
        address: "",
        city: "",
        state: "",
        country: ""
      },
      socialMedia: {
        linkedin: "",
        facebook: ""
      }
    }
  })

  // Fetch existing company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsFetching(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/company/setup", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data._id) { // Check if company data exists
            form.reset(data); // Pre-fill the form
            setPreviewLogo(data.logo || "");
            setIsEditMode(true);
            // Trigger progress update after form reset
            // Small timeout to ensure form state is updated before calculating progress
            setTimeout(updateProgress, 0);
          }
        } else if (response.status === 404) {
          // No company profile found, proceed with setup mode
          setIsEditMode(false);
        } else {
          // Handle other errors
          toast.error("Failed to load company data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching company data.");
        console.error("Fetch company data error:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCompanyData();
  }, [form]); // form is a dependency for form.reset

  // Track form completion progress
  const updateProgress = () => {
    const values = form.getValues();
    const updatedSections = {
      "basic-info": !!values.name && !!values.website,
      "company-details": !!values.industry && !!values.size && !!values.founded,
      "about-company": !!values.description && values.description.length >= 50,
      "location": !!values.location.address && !!values.location.city && !!values.location.state && !!values.location.country,
      "social-media": true // Optional section
    };
    
    setCompletedSections(updatedSections);
    
    const completedCount = Object.values(updatedSections).filter(Boolean).length;
    const percentage = Math.floor((completedCount / Object.keys(updatedSections).length) * 100);
    setCompletionPercentage(percentage);
  };

  // Update logo preview
  const handleLogoChange = (url: string) => {
    form.setValue("logo", url);
    setPreviewLogo(url);
  };

  // Handle section change
  const handleSectionChange = (section: string) => {
    setExpandedSection(section);
    updateProgress();
  };

  // Submit handler
  async function onSubmit(values: z.infer<typeof companySchema>) {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token');
      const method = isEditMode ? "PUT" : "POST";
      const response = await fetch("/api/company/setup", {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values)
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || (isEditMode ? "Failed to update company profile." : "Failed to create company profile."))
      }
  
      toast.success(isEditMode ? "Company profile updated successfully!" : "Company profile created successfully!")
      router.push("/recruiter/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    } 
  }

  return (
    <div className="container py-10">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-primary/5 rounded-t-lg border-b pb-8">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{isEditMode ? "Update Company Profile" : "Company Setup"}</CardTitle>
              <CardDescription className="text-base mt-2">
                {isEditMode ? "Keep your company information up to date." : "Complete your company profile to start attracting top talent"}
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={updateProgress} className="space-y-4">
              <Accordion
                type="single"
                collapsible
                value={expandedSection}
                onValueChange={handleSectionChange}
              >
                {/* Basic Information */}
                <AccordionItem value="basic-info">
                  <AccordionTrigger className="py-4 px-2 hover:bg-muted/50 rounded-md group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSections["basic-info"] ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-medium">Basic Information</h3>
                        <p className="text-sm text-muted-foreground">Company name and website</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2 space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Inc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website <span className="text-red-500">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Logo URL</FormLabel>
                            <div className="flex gap-4 items-start">
                              <div className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/logo.png" 
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      handleLogoChange(e.target.value);
                                    }} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  URL to your company logo (PNG, JPG, or SVG)
                                </FormDescription>
                                <FormMessage />
                              </div>
                              {previewLogo && (
                                <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={previewLogo} 
                                    alt="Company Logo" 
                                    className="max-w-full max-h-full object-contain"
                                    onError={() => setPreviewLogo("")}
                                  />
                                </div>
                              )}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Company Details */}
                <AccordionItem value="company-details">
                  <AccordionTrigger className="py-4 px-2 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSections["company-details"] ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-medium">Company Details</h3>
                        <p className="text-sm text-muted-foreground">Industry, size, and founding year</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2 space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INDUSTRIES.map(industry => (
                                  <SelectItem key={industry.value} value={industry.value}>
                                    {industry.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">Small (1-50 employees)</SelectItem>
                                <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                                <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                                <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="founded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founded Year <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2010" {...field} />
                            </FormControl>
                            <FormDescription>Year the company was established (YYYY)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="headquarters"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headquarters <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* About Company */}
                <AccordionItem value="about-company">
                  <AccordionTrigger className="py-4 px-2 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSections["about-company"] ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-medium">About Company</h3>
                        <p className="text-sm text-muted-foreground">Company description and mission</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell potential candidates about your company's mission, values, and culture..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            <FormDescription>Minimum 50 characters</FormDescription>
                            <span className="text-xs text-muted-foreground">{field.value.length} characters</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Location */}
                <AccordionItem value="location">
                  <AccordionTrigger className="py-4 px-2 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSections["location"] ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        <Map className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-medium">Location</h3>
                        <p className="text-sm text-muted-foreground">Primary office address</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2 space-y-4">
                    <FormField
                      control={form.control}
                      name="location.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="123 Business Ave" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="location.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="State or Province" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Social Media */}
                <AccordionItem value="social-media">
                  <AccordionTrigger className="py-4 px-2 hover:bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completedSections["social-media"] ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-medium">Social Media</h3>
                        <p className="text-sm text-muted-foreground">Optional: Connect social profiles</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground -mt-2">
                        Adding social media profiles helps candidates learn more about your company culture.
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="socialMedia.linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/company/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="socialMedia.facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook</FormLabel>
                              <FormControl>
                                <Input placeholder="https://facebook.com/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading || isFetching || (completionPercentage < 80 && !isEditMode)} // Allow update even if not 80% for edit mode, but still disable during fetch/load
            className="min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {isEditMode ? "Updating..." : "Setting Up..."}
              </>
            ) : (
              isEditMode ? "Update Profile" : "Complete Setup"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}