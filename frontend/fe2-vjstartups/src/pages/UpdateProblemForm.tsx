import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "../pages/UserContext";
import axios from "axios";

interface UpdateProblemData {
  title: string;
  briefparagraph: string;
  description: string;
  background: string;
  scalability: string;
  marketSize: string;
  existingSolutions: string;
  currentGaps: string;
  targetCustomers: string;
  tags: string;
  authorName: string;
  image?: File | null;
}

const UpdateProblemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const { register, handleSubmit, setValue, formState, reset } = useForm<UpdateProblemData>({
    defaultValues: {},
  });
  const { errors, isSubmitting } = formState;

  // Fetch existing problem data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${id}`
        );
        const data = res.data;
        // Populate form
        setValue("title", data.title);
        setValue("briefparagraph", data.briefparagraph);
        setValue("description", data.description); // Added missing description field
        setValue("background", data.background);
        setValue("scalability", data.scalability);
        setValue("marketSize", data.marketSize);
        setValue("existingSolutions", data.existingSolutions);
        setValue("currentGaps", data.currentGaps);
        setValue("targetCustomers", data.targetCustomers);
        
        // Set tags if they exist
        if (data.tags && Array.isArray(data.tags)) {
          setValue("tags", data.tags.join(", "));
        }

        if (data.image) setImagePreview(data.image);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to load problem data", variant: "destructive" });
      }
    };
    fetchProblem();
  }, [id, reset, toast, user?.name]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

 const handleDialogChange = (isOpen: boolean) => {
  setOpen(isOpen);
  if (!isOpen) {
    reset();
    setSelectedImage(null);
    setImagePreview(null);
    navigate(`/problems/${id}`); // Go back to the specific problem
  }
};


  const onSubmit = async (data: UpdateProblemData) => {
    if (!user?.email) {
      toast({
        title: "Login required",
        description: "Please login to update problem.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("briefparagraph", data.briefparagraph);
      formData.append("description", data.description);
      formData.append("background", data.background);
      formData.append("scalability", data.scalability);
      formData.append("marketSize", data.marketSize);
      formData.append("existingSolutions", data.existingSolutions);
      formData.append("currentGaps", data.currentGaps);
      formData.append("targetCustomers", data.targetCustomers);
      formData.append("addedByName", data.authorName);
      formData.append("addedByEmail", user.email);

      const tagsArray = data.tags ? data.tags.split(",").map(t => t.trim()) : [];
      tagsArray.forEach(tag => formData.append("tags[]", tag));

      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/problem-api/problems/${id}/${user.email}`,
        formData
      );

      toast({ title: "Problem updated successfully!" });
      // Navigate back to the problem detail page
      navigate(`/problems/${id}`);
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.response?.data?.message || "Failed to update problem",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            Update Problem
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Problem Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter problem title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="briefparagraph">Brief Summary *</Label>
            <Textarea
              id="briefparagraph"
              {...register("briefparagraph", { required: "Summary is required" })}
              placeholder="Brief description"
              rows={2}
            />
            {errors.briefparagraph && (
              <p className="text-red-500 text-sm mt-1">
                {errors.briefparagraph.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="targetCustomers">Target Customer(s) *</Label>
            <Textarea
              id="targetCustomers"
              {...register("targetCustomers", { required: "Target customers is required" })}
              placeholder="Who has this problem more often? (e.g., College students, Small business owners, Elderly people, etc.)"
              rows={2}
            />
            {errors.targetCustomers && (
              <p className="text-red-500 text-sm mt-1">{errors.targetCustomers.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Provide a detailed explanation of the problem"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="background">Background</Label>
            <Textarea id="background" {...register("background")} rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scalability">Scalability</Label>
              <Textarea id="scalability" {...register("scalability")} rows={2} />
            </div>

            <div>
              <Label htmlFor="marketSize">Market Size</Label>
              <Input id="marketSize" {...register("marketSize")} />
            </div>
          </div>

          <div>
            <Label htmlFor="existingSolutions">Existing Solutions / Competitors</Label>
            <Input id="existingSolutions" {...register("existingSolutions")} />
          </div>

          <div>
            <Label htmlFor="currentGaps">Current Gaps</Label>
            <Textarea id="currentGaps" {...register("currentGaps")} rows={2} />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g., Sustainability, Technology, Healthcare (comma-separated)"
            />
          </div>

          <div>
            <Label htmlFor="image">Problem Cover Photo</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Problem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProblemForm;
